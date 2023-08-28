class ApiError extends Error {
    constructor(ref, code, msg) {
        super(msg)
        this.ref = ref
        this.code = code
        this.msg = msg
        Error.captureStackTrace(this)
    }
}
module.exports = ApiError