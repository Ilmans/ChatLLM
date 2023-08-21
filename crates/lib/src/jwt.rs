use std::sync::Arc;

use axum::{extract::FromRequestParts, http::{request::Parts, header}, async_trait, TypedHeader, headers::{Authorization, authorization::Bearer}};
use errors::{service::ServiceError, api::ApiError};
use jsonwebtoken::{decode, DecodingKey, Validation};
use once_cell::sync::Lazy;
use serde::{Serialize, Deserialize};

static JWT_KEY: Lazy<String> = Lazy::new(|| {
    let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    secret
});


#[derive(Debug, Serialize, Deserialize)]
pub struct JwtClaims {
    pub exp: i64,
    pub user_id: i32,
    pub username: String
}


pub fn verify_jwt_token(token: String, secret: String) -> Result<JwtClaims, ServiceError> {
    let t = decode::<JwtClaims>(
        &token, 
        &DecodingKey::from_secret(JWT_KEY.as_ref()),
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
        let header_value = parts.headers.get("Authorization").ok_or(false)
            .map_err(|_| ServiceError::Unauthorized)?
            .to_str().unwrap();
        let token = &header_value[7..];

        let token_data = decode::<JwtClaims>(
            token,
            &DecodingKey::from_secret(JWT_KEY.as_ref()), 
            &Validation::default()
        ).map_err(|_| ServiceError::Unauthorized)?;

        Ok(token_data.claims)
    }
}