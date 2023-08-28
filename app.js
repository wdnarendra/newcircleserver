const express = require('express')

const figlet = require('figlet')

const config = require('./src/config/config')

require('./src/config/connect')(config.MONGO_URL)

const morgan = require('./src/config/morgan')

const { errorHandlor, errorConverter } = require('./src/middleware/error')

const route = require('./src/route')

const app = express()

const { v4: uuid } = require('uuid')

app.use(express.json())

app.use((req, res, next) => {
    req.id = uuid()
    // if (!req.body.operationName)
    //     next(new ApiError('/app', httpStatus.NOT_FOUND, 'operationName key not exist'))
    // else {
    //     req.operationName = req.body.operationName
    //     next()
    // }
}, morgan)

app.use(route)

app.use('*', (req, res) => {
    res.status(404).json({ status: 404, data: 'url not exist' })
})

app.use(errorConverter)

app.use(errorHandlor)

app.listen(config.PORT, () => {
    console.log(figlet.textSync('Hi-Circle Server', {
        font: 'Chunky',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }))

    console.log(`Server listening on ${config.PORT}`)

    console.log(
        '---------------------------------------------------------------------'
    );
    console.log('Time : ' + new Date());
    console.log('-------------Current Environment Name ------------------ ');
    console.log(config.NODE_ENV);
    console.log(
        '----------------------------------------------------------------------'
    );
})