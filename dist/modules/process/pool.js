"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../helpers/logger");
var result_1 = require("../../helpers/result");
var Pool = /** @class */ (function () {
    function Pool(_a) {
        var maxPoolSize = _a.maxPoolSize;
        this.inactiveElements = {};
        this.activeElements = {};
        this.maxPoolSize = maxPoolSize || 5;
    }
    Pool.prototype.add = function (element) {
        this.inactiveElements[element.id] = element;
        console.log({ inactiveThis: this });
    };
    Pool.prototype.canAllocate = function () {
        return (Object.keys(this.activeElements).length < this.maxPoolSize) &&
            Object.keys(this.inactiveElements).length > 0;
    };
    Pool.prototype.get = function (id, jobPool) {
        if (jobPool === void 0) { jobPool = this.inactiveElements; }
        var job = jobPool[id];
        if (!job) {
            return result_1.Result.Failure(new Error('Expected job but found none.'));
        }
        return result_1.Result.Success(job);
    };
    Pool.prototype.allocate = function (id) {
        if (!this.canAllocate()) {
            throw new Error("Expected to be able to allocate but cannot.");
        }
        if (typeof id === 'undefined') {
            var keys = Object.keys(this.inactiveElements);
            id = Number(keys[0]);
        }
        var element = this.get(id, this.inactiveElements);
        if (element.failure) {
            throw element.failure;
        }
        this.activateElement(id);
        return element.success;
    };
    Pool.prototype.activateElement = function (id) {
        var inactiveElement = this.get(id, this.inactiveElements);
        if (inactiveElement.failure) {
            throw inactiveElement.failure;
        }
        this.activeElements[id] = inactiveElement.success;
        delete this.inactiveElements[id];
    };
    Pool.prototype.deactivateElement = function (id) {
        var activeElement = this.get(id, this.activeElements);
        if (activeElement.failure) {
            logger_1.Logger.log("Failed to deactivate element " + id);
            return;
        }
        this.inactiveElements[id] = activeElement.success;
        delete this.activeElements[id];
    };
    Pool.prototype.delete = function (id) {
        logger_1.Logger.log('Mark complete ' + id);
        delete this.activeElements[id];
        delete this.inactiveElements[id];
    };
    Pool.prototype.isActive = function (id) {
        return this.activeElements[id] !== undefined;
    };
    Object.defineProperty(Pool.prototype, "size", {
        get: function () {
            return Object.keys(this.inactiveElements).length + Object.keys(this.activeElements).length;
        },
        enumerable: true,
        configurable: true
    });
    return Pool;
}());
exports.Pool = Pool;
