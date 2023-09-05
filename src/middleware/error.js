const httpStatus = require("http-status")

const logger = require('../config/winston')

const { NODE_ENV } = require('../config/config')

module.exports.errorHandlor = (err, req, res, next) => {
    let { code, ref, msg, stack, name } = err

    msg = msg.replace(/\"/g, '')

    stack = stack.replaceAll(/\"/g, '')

    logger.error(`${req.id} - ${name} - ${code || 500} - ${res.statusMessage} - ${msg} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    if (NODE_ENV !== 'staging')
        return res.status(code).send(JSON.stringify({ statusCode: code, message: msg, reference: ref, error: name }))

    res.status(code).send(JSON.stringify({ statusCode: code, message: msg, stackTrace: stack, reference: ref, error: name }))
}

module.exports.errorConverter = (err, req, res, next) => {

    console.log(err)

    if (err?.code === 'auth/user-not-found') {
        next(new ApiError('/src/middleware/error', httpStatus.NOT_FOUND, err.message))
    }

    if (err?.codePrefix === 'auth') {
        next(new UnauthorizedError('/src/middleware/error'))
    }

    if (err instanceof ApiError || err instanceof UnauthorizedError || err instanceof NotFoundError) {
        next(err)
    }
    else
        next(new ApiError('/src/middleware/error', httpStatus.INTERNAL_SERVER_ERROR, 'internal server error'))
}