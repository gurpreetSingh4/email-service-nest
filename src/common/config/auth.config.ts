export const AUTH_CONFIG = ()=> {
    return {
        JWT_SECRET: process.env["JWT_SECRET"],
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env["JWT_ACCESS_TOKEN_EXPIRATION_TIME"],
        GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
        GOOGLE_CLIENT_SECRET: process.env["GOOGLE_CLIENT_SECRET"],
        TOKEN_ENDPOINT: process.env["TOKEN_ENDPOINT"],
        OAUTH_ROOT_URL: process.env["OAUTH_ROOT_URL"],
        ENCRYPTION_KEY: process.env["ENCRYPTION_KEY"],
        USER_INFO_ENDPOINT: process.env["USER_INFO_ENDPOINT"],
        SESSION_SECRET_KEY: process.env["SESSION_SECRET_KEY"],
    }
}