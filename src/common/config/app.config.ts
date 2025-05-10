export const APP_CONFIG = () => {
    return {
        PORT: process.env["PORT"],
        NODE_ENV: process.env["NODE_ENV"],
        DEFAULT_PROFILE_PIC: process.env["DEFAULT_PROFILE_PIC"],
        VITE_OAUTH_GMAIL_CALLBACK: process.env["VITE_OAUTH_GMAIL_CALLBACK"],
        GOOGLE_REDIRECT_URL: process.env["GOOGLE_REDIRECT_URL"],
        EMAIL_SERVICE_URL: process.env["EMAIL_SERVICE_URL"],
        VITE_FRONTEND_URL: process.env["VITE_FRONTEND_URL"],
    }
}