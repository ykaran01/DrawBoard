export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (err) {
       
        let statusCode = err.code === 11000 ? 400 : err.code;
        statusCode = (statusCode >= 100 && statusCode < 600) ? statusCode : 500;
        
        const message = err.code === 11000 
            ? "Duplicate field value entered: Account already exists." 
            : err.message;

        res.status(statusCode).json({
            success: false,
            code: statusCode,
            message: message
        })
    }
}