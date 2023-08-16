use errors::service::ServiceError;
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