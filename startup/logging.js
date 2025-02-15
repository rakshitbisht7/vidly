const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  // Prevent duplicate transports
  if (!winston.transports.File) {
    winston.exceptions.handle(
      new winston.transports.Console({ format: winston.format.simple() }),
      new winston.transports.File({ filename: "uncaughtExceptions.log" })
    );

    process.on("unhandledRejection", (ex) => {
      winston.error(ex.message, ex);
      process.exit(1);
    });

    winston.add(new winston.transports.File({ filename: "logfile.log" }));
  }
};
