class ApiError extends Error {
    constructor(ref, code, msg) {
        super(msg)
        this.name = 'ApiError'
        this.ref = ref
        this.code = code
        this.msg = msg
        Error.captureStackTrace(this)
    }
}

const apiErrors = Object.entries({
    BadRequest: {
        code: 400,
        msg: 'Bad Request',
    },
    Unauthorized: {
        code: 401,
        msg: 'Unathorized',
    },
    AccessDeniedError: {
        code: 401,
        msg: 'Access denied',
    },
    Forbidden: {
        code: 403,
        msg: 'Forbidden',
    },
    NotFound: {
        code: 404,
        msg: 'Not found',
    },
    Conflict: {
        code: 409,
        msg: 'Conflict',
    },
    UnSupportedMediaType: {
        code: 415,
        msg: 'Unsupported Media Type',
    },
    UnProcessableEntity: {
        code: 422,
        msg: 'Unprocessable Entity',
    },
    InternalServer: {
        code: 500,
        msg: 'Internal Server Error',
    },
    MethodNotAllowed: {
        code: 405,
        msg: 'Method Not Allowed',
    },
}).reduce((map, [name, data]) => {
    map[`${name}Error`] = map[name] = class extends Error {
        constructor(ref) {
            super(data.msg);
            this.name = `${name}Error`;
            this.code = data.code;
            this.ref = ref
            this.msg = data.msg
            Error.captureStackTrace(this)
        }
    };
    return map;
}, {});
Object.keys(apiErrors).map(elt => {
    global[elt] = apiErrors[elt];
})
global['ApiError'] = ApiError;

