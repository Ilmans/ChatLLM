use std::{convert::Infallible, path::{Path, PathBuf}, io::{self, Write}};

use llm::{conversation_inference_callback, Model, InferenceParameters, InferenceSession, ModelParameters};
use rand::rngs::ThreadRng;

struct Args {
    model_architecture: llm::ModelArchitecture,
    model_path: PathBuf,
    pub tokenizer_path: Option<PathBuf>,
    pub tokenizer_repository: Option<String>
}
impl Args {
    pub fn to_tokenizer_source(&self) -> llm::TokenizerSource {
        match (&self.tokenizer_path, &self.tokenizer_repository) {
            (Some(_), Some(_)) => {
                panic!("Cannot specify both --tokenizer-path and --tokenizer-repository")
            },
            (Some(path), None) => llm::TokenizerSource::HuggingFaceTokenizerFile(path.to_owned()),
            (None, Some(repo)) => llm::TokenizerSource::HuggingFaceRemote(repo.to_owned()),
            (None, None) => llm::TokenizerSource::Embedded
        }
    }
}

pub struct MyLLM {
    inference_parameters: InferenceParameters,
    session: InferenceSession,
    model: Box<dyn Model>,
}

impl MyLLM {
    pub fn new() -> Self {
        let tokenizer_source = llm::TokenizerSource::Embedded;
        let model_architecture = llm::ModelArchitecture::GptNeoX;
        let model_path = Path::new("/Users/zuramai/Code/LLM/models/RedPajama-INCITE-Base-3B-v1/RedPajama-INCITE-Base-3B-v1-q4_0.bin");
        let model_parameters = ModelParameters {
            prefer_mmap: true,
            context_size: 2048,
            lora_adapters: None,
            use_gpu: false,
            gpu_layers: None,
            rope_overrides: None,
            n_gqa: None,
        };

        let model = llm::load_dynamic(
            Some(model_architecture), 
            &model_path, 
            llm::TokenizerSource::HuggingFaceTokenizerFile(PathBuf::from("/Users/zuramai/Code/LLM/models/RedPajama-INCITE-Base-3B-v1/tokenizer.json")),
            model_parameters, 
            llm::load_progress_callback_stdout
        ).unwrap();

        let mut session = model.start_session(Default::default());
        let persona = "A chat between a teacher and a student";
        let character_name = "### Teacher";
        let user_name = "### Student";
        let history = format!("{user_name}: You are my english instructor. \
            You are very expert in English language and have wide vocabularies. You are very good at explaining something. \
            You will always give a alternatives to write a sentence in a different ways. \
            You can always fix my grammar and give vocabularies alternatives.");

        session.feed_prompt(
                model.as_ref(), 
                format!("{persona}\n{history}").as_str(), 
                &mut Default::default(), 
            llm::feed_prompt_callback(|resp| match resp {
                llm::InferenceResponse::PromptToken(t) | llm::InferenceResponse::InferredToken(t) => {
                    print_token(t);

                    Ok::<llm::InferenceFeedback, Infallible>(llm::InferenceFeedback::Continue)
                }
                _ => Ok(llm::InferenceFeedback::Continue)
            }) 
        ).expect("Failed to ingest initial prompt");

        Self {
            inference_parameters: Default::default(),
            session: model.start_session(Default::default()),
            model,
        }
    }


    pub fn send_message(&mut self, msg: String) -> String {
        let character_name = "### Teacher";
        let user_name = "### Student";
        println!("{user_name}: {msg}");
        let mut response = String::from("");
        let stats = self.session
            .infer::<Infallible>(self.model.as_ref(),
                &mut rand::thread_rng(),
                &llm::InferenceRequest {
                    maximum_token_count: Some(20),
                    play_back_previous_tokens: false, 
                    parameters: &self.inference_parameters,
                    prompt: format!("{user_name}: {msg}\n{character_name}:").as_str().into()
                }, 
                &mut Default::default(), 
                conversation_inference_callback(&format!("{character_name}:"), |token| {
                    print!("{}",token);
                    response.push_str(token.as_str());
                })
            ).unwrap();
        response
    }
}


fn print_token(t: String) {
    print!("{t}");
    io::stdout().flush().unwrap();
}