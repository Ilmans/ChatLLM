use std::sync::Arc;

use axum::{extract::FromRequestParts, http::request::Parts, async_trait, TypedHeader, headers::{Authorization, authorization::Bearer}};
use errors::{service::ServiceError, api::ApiError};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct JwtClaims {
    pub exp: i64,
    pub user_id: i32,
    pub username: String
}


pub fn verify_jwt_token(token: String, secret: String) -> Result<JwtClaims, ServiceError> {
    let t = decode::<JwtClaims>(
        &token, 
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(jsonwebtoken::Algorithm::HS256)
    ).map_err(|err| {
        ServiceError::Unauthorized
    })?;
    Ok(t.claims)
}

#[async_trait]
impl<S> FromRequestParts<S> for JwtClaims {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, ApiError> {
        let token = parts.headers.get("Authorization").ok_or(false)
            .map_err(|_| ServiceError::Unauthorized)?;
        println!("Token: {:?}",token.to_str());
        
        // Decode the user data
        // let token_data = decode::<Claims>(bearer.token(), &KEYS.decoding, &Validation::default())
        //     .map_err(|_| AuthError::InvalidToken)?;

        Ok(Self {
            exp: 2,
            user_id: 2,
            username: "ast".into()
        })
    }
}