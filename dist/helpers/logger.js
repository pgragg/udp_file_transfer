"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Object.defineProperty(Logger, "shouldLog", {
        get: function () { return process.env['DEBUG_LOG'] === 'true'; },
        enumerable: true,
        configurable: true
    });
    Logger.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!Logger.shouldLog) {
            return;
        }
        optionalParams ? console.log(message, optionalParams) : Logger.log(message);
    };
    Logger.info = function (message, data) {
        if (!Logger.shouldLog) {
            return;
        }
        data ? console.info(message, data) : console.info(message);
    };
    Logger.error = function (message, data) {
        if (!Logger.shouldLog) {
            return;
        }
        data ? console.error(message, data) : console.error(message);
    };
    return Logger;
}());
exports.Logger = Logger;
