const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  // Handle Uncaught Exceptions
  winston.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // Handle Unhandled Promise Rejections
  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // Add File Transport for Logging
  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  // Optional: Add MongoDB Logging if needed
  // winston.add(new winston.transports.MongoDB({ db: "mongodb://localhost/vidly", level: "error" }));
};
