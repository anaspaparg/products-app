const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
require('winston-mongodb');

require('dotenv').config();

const { combine, timestamp, label, prettyPrint } = format;

const CATEGORY = "winston custom format";

const fileRotateTransport = new transports.DailyRotateFile({ // a transport is to write to console or to a file logger or to db
    filename: "logs/rotate-%DATE%.log",
    datePattern: "DD-MM-YYYY",
    maxFiles: "14d"
});

const logger = createLogger({
    level: "debug",
    format: combine(
        label({ label: CATEGORY}),
    timestamp({
        format: "DD-MM-YYYY HH:mm:ss"
    }),
    //format.json()
    prettyPrint()
    ),
    transports: [
        fileRotateTransport,
        new transports.File({
            filename: "logs/example.log"
        }),
        new transports.File({
            level: "error",
            filename: "logs/error.log"
        }),
        new transports.Console(),
        new transports.MongoDB({
            level: "error",
            db: process.env.MONGODB_URI,
            options: {
                useUnifiedTopology: true
            },
            collection: "servrer_logs",
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ] 
})

module.exports = logger;

