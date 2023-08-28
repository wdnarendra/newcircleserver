const httpStatus = require("http-status")

const ApiError = require('../utils/ApiError')

const logger = require('../config/winston')

module.exports.errorHandlor = (err, req, res, next) => {
    let { code, ref, msg, stack } = err

    msg = msg.replace(/\"/g, '')

    stack = stack.replaceAll(/\"/g, '')

    logger.error(`${req.id} - ${req.operationName} - ${code || 500} - ${res.statusMessage} - ${msg} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(code).send(JSON.stringify({ statusCode: code, message: msg, stackTrace: stack, reference: ref }))

}

module.exports.errorConverter = (err, req, res, next) => {
    if (err instanceof ApiError) {
        next(err)
    }
    else
        next(new ApiError('/src/middleware/error', httpStatus.INTERNAL_SERVER_ERROR, 'internal server error'))
}