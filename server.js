const AV = require('leanengine')

AV.init({
    appId: process.env.LEANCLOUD_APP_ID,
    appKey: process.env.LEANCLOUD_APP_KEY,
    masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
})

const app = require('./app')

const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000)

app.listen(PORT, function (err) {
    console.log('Node app is running on port:', PORT)

    process.on('uncaughtException', function (err) {
        console.error('Caught exception:', err.stack)
    })

    process.on('unhandledRejection', function (reason, p) {
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack)
    })
})

