export const DATA_BASE_CONFIG = () => {
    return {
        MONGODB_URI: process.env["MONGODB_URI"],
        PG_DATABASE_URL: process.env["PG_DATABASE_URL"]
    }
}