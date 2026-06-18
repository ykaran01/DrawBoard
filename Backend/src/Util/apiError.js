class ApiError extends Error{
    constructor(
        statusCode,
        message,
        error = []
    ){
        super(message)
        this.data = null
        this.error = error

    }
}

export {ApiError}