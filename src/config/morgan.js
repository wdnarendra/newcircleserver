const morgan = require('morgan')

const fs = require('fs')

const path = require('path')

const writeStream = fs.createWriteStream(path.join(__dirname, '../../logs/requestLogs.log'), { flags: 'a' })

morgan.token('id', (req) => {
    return req.id
})
morgan.token('operationName', (req) => {
    return req.operationName
})

const morganHandlor = morgan(':id :operationName :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: writeStream })

module.exports = morganHandlor