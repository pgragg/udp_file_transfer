"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result = /** @class */ (function () {
    function Result() {
    }
    Result.Failure = function (params) {
        return { failure: params };
    };
    Result.Success = function (params) {
        return { success: params };
    };
    return Result;
}());
exports.Result = Result;
