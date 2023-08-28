use std::{convert::Infallible, path::{Path, PathBuf}};

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
        let model_architecture = llm::ModelArchitecture::Llama;
        let model_path = Path::new("/Users/zuramai/Code/LLM/models/Wizard-Vicuna-7B-Uncensored.ggmlv3.q4_0.bin");
        let model_parameters = ModelParameters {
            prefer_mmap: true,
            context_size: 2048,
            lora_adapters: None,
            use_gpu: true,
            gpu_layers: None,
            rope_overrides: None,
            n_gqa: None,
        };

        let model = llm::load_dynamic(
            Some(model_architecture), 
            &model_path, 
            tokenizer_source, 
            model_parameters, 
            llm::load_progress_callback_stdout
        ).unwrap();

        let mut session = model.start_session(Default::default());
        let persona = "A chat between a human and an assistant.";
        let character_name = "### Assistant";
        let user_name = "### Human";
        let history = format!(
            "{character_name}: Hello - How may I help you today?\n\
            {user_name}: What is the capital of France?\n\
            {character_name}: Paris is the capital of France"
        );
    
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


    pub fn send_message(&mut self, msg: String) {
        let character_name = "### Assistant";
        let user_name = "### Human";
        println!("{user_name}: {msg}");

        let stats = self.session
            .infer::<Infallible>(self.model.as_ref(),
                &mut rand::thread_rng(),
                &llm::InferenceRequest {
                    maximum_token_count: Some(100),
                    play_back_previous_tokens: false, 
                    parameters: &self.inference_parameters,
                    prompt: format!("{user_name}: {msg}\n{character_name}:").as_str().into()
                }, 
                &mut Default::default(), 
                conversation_inference_callback(&format!("{character_name}:"), |token| {
                    print!("{}",token);
                })
            ).unwrap();
    }
}


fn print_token(t: String) {
    print!("{t}");
}