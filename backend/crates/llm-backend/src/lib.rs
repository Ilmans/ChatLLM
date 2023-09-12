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
        let model_architecture = llm::ModelArchitecture::Llama;
        let model_path = Path::new("/Users/zuramai/Code/LLM/llama.cpp/models/7B/7B.bin");
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
            llm::TokenizerSource::Embedded,
            model_parameters, 
            llm::load_progress_callback_stdout
        ).unwrap_or_else(|err| {
            panic!("Failed to load {model_architecture} model from {model_path:?}: {err}")
        });

        let mut session = model.start_session(Default::default());
        // let persona = "A chat between a teacher and a student";
        // let character_name = "### Teacher";
        // let user_name = "### Student";
        // let history = format!("{user_name}: You are my english instructor. \
        //     You are very expert in English language and have wide vocabularies. You are very good at explaining something. \
        //     You will always give a alternatives to write a sentence in a different ways. \
        //     You can always fix my grammar and give vocabularies alternatives.");
        let prompt = "### User: You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n
If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.
### Assistant:
";

        session.feed_prompt(
                model.as_ref(), 
                prompt, 
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
        let character_name = "### Assistant";
        let user_name = "### User";
        println!("{user_name}: {msg}");
        let mut response = String::from("");
        print!("{character_name}: ");
        let stats = self.session
            .infer::<Infallible>(self.model.as_ref(),
                &mut rand::thread_rng(),
                &llm::InferenceRequest {
                    maximum_token_count: Some(100),
                    play_back_previous_tokens: false, 
                    parameters: &self.inference_parameters,
                    prompt: format!("{user_name}: {msg}\n{character_name}: ").as_str().into()
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