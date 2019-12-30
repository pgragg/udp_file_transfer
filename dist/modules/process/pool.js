"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../helpers/logger");
var Pool = /** @class */ (function () {
    function Pool(_a) {
        var maxPoolSize = _a.maxPoolSize;
        this.inactiveElements = {};
        this.activeElements = {};
        this.maxPoolSize = maxPoolSize || 5;
    }
    Pool.prototype.add = function (element) {
        this.inactiveElements[String(element.id)] = element;
        console.log({ inactiveThis: this });
    };
    Pool.prototype.isUnderMaxAllocation = function () {
        return (Object.keys(this.activeElements).length < this.maxPoolSize) &&
            Object.keys(this.inactiveElements).length > 0;
    };
    Pool.prototype.get = function (id, jobPool) {
        if (jobPool === void 0) { jobPool = this.inactiveElements; }
        var job = jobPool[String(id)];
        if (!job) {
            throw new Error('Expected job but found none.');
        }
        return job;
    };
    Pool.prototype.allocate = function (id) {
        if (!this.isUnderMaxAllocation()) {
            return;
        }
        if (typeof id !== 'number') {
            var keys = Object.keys(this.inactiveElements);
            console.log({ keys: keys });
            id = Number(keys[0]);
        }
        if (typeof id !== 'number') {
            logger_1.Logger.log("--- Could not find job id --- " + id);
            logger_1.Logger.log("" + JSON.stringify(this));
            return;
        }
        var element = this.get(id, this.inactiveElements);
        this.activeElements[String(id)] = this.get(id, this.inactiveElements);
        delete this.inactiveElements[id];
        return element;
    };
    Pool.prototype.delete = function (id) {
        logger_1.Logger.log('Mark complete ' + id);
        delete this.activeElements[String(id)];
    };
    return Pool;
}());
exports.Pool = Pool;
