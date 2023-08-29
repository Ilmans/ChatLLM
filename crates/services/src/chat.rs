use std::{thread, sync::{Arc, Mutex}};

use async_trait::async_trait;
use errors::service::ServiceError;
use llm_backend::MyLLM;


#[async_trait]
pub trait ChatService {
    async fn send_message(
        &self,
        message: String
    ) -> Result<String, ServiceError>;
}

pub struct ChatServiceImpl {
    pub llm: Arc<Mutex<MyLLM>>
}

#[async_trait]
impl ChatService for ChatServiceImpl {
    async fn send_message(&self, message: String) -> Result<String, ServiceError> {
        let worker = self.llm.clone();
        let t = thread::spawn(move || {
            let ref mut model_manager = worker
                .lock()
                .expect("Error mutex");
            model_manager.send_message(message)
        });
        let response = t.join().unwrap();
        println!("{response}");

        Ok(response)
    }
}