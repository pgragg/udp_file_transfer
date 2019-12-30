"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWriterPorts = function (_a) {
    var maxPoolSize = _a.maxPoolSize;
    var ports = [];
    for (var poolSize = 0; poolSize < maxPoolSize; poolSize++) {
        var port = 2222 + poolSize;
        ports.push(port);
    }
    return ports;
};
