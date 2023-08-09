export { SOCKET_EVENT_KEYS } from './socket-event-keys.js'
export const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT : 409,
    FORBIDDEN: 403,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    REQUEST_TIMEOUT: 408,
    PAYMENT_REQUIRED: 402
}

export const ErrorResponse = ( message) => {
    return { error: message }
}

export const SuccessResponse = ( message) => {
    return { success: message }
}