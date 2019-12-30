"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Statistics = /** @class */ (function () {
    function Statistics() {
        this.successes = 0;
        this.tries = 0;
        this.failures = {};
        this.successfulBytes = 0;
        // Start arbitrarily high
        this.totalBytes = 1000000;
    }
    Statistics.prototype.failure = function (error) {
        this.failures[error.message] = this.failures[error.message] || 0;
        this.failures[error.message] += 1;
    };
    Statistics.prototype.success = function (message) {
        this.successes += 1;
        if ('data' in message.payload) {
            this.totalBytes = message.payload.totalBytes;
            this.successfulBytes += message.payload.data.length;
        }
    };
    return Statistics;
}());
exports.Statistics = Statistics;
