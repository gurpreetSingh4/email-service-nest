export const RABBITMQ_CONFIG = () => {
    return {
        RABBITMQ_URL: process.env["RABBITMQ_URL"],
        RABBITMQ_ROUTINGKEY_POSTCREATE: process.env["RABBITMQ_ROUTINGKEY_POSTCREATE"],
        RABBITMQ_ROUTINGKEY_POSTDELETE: process.env["RABBITMQ_ROUTINGKEY_POSTDELETE"],
        // RABBITMQ_EXCHANGENAME: process.env["RABBITMQ_EXCHANGENAME"],
    }
}