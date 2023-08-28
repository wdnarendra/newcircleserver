const winston = require('winston')

const path = require('path')

const logger = winston.createLogger({
    transports: new winston.transports.File({
        filename: path.join(__dirname, '../../logs/errorLogs.log'),
        format: winston.format.combine(
            winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
            winston.format.align(),
            winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )
    })
})

module.exports = logger