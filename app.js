const AV = require('leanengine')
const express = require('express')
const timeout = require('connect-timeout')

const app = express()

// web socket
require('express-ws')(app)

// cors
const cors = require("cors")
app.use(cors())

app.use(timeout('15s'))
app.use(AV.express())

// https
app.enable('trust proxy')
app.use(AV.Cloud.HttpsRedirect())


// proxy
const proxy = require("http-proxy-middleware").createProxyMiddleware
console.log('Target = %s', process.env.TARGET)
console.log('Platform = %s', process.env.PLATFORM)
app.use("/", proxy(["/"], {
    headers: {
        'X-LC-Platform': process.env.PLATFORM
    },
    target: process.env.TARGET,
    changeOrigin: true,
    // pathRewrite: {
    //     "^/api": ""
    // }
}))

// error handlers
app.use(function (err, req, res, _next) {
    // ignore ws
    if (req.timedout && req.headers.upgrade === 'websocket') {
        return
    }

    let statusCode = err.status || 500
    if (statusCode === 500) {
        console.error(err.stack || err)
    }
    if (req.timedout) {
        console.error('Request time: url=%s, timeout=%d', req.originalUrl, err.timeout)
    }

    res.status(statusCode)
    let error = {}
    if (app.get('env') === 'development') {
        error = err
    }
    res.json({
        errorMessage: err.message,
        errorCode: statusCode,
        error: error
    })
})

module.exports = app
