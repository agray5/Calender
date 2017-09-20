class CustomError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, CustomError)
    }
}

export class CreateError extends CustomError {
    constructor(...args) {
        super("Create error.", ...args);
    }
}