"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = require("./pool");
var udpSocket_1 = require("../../entities/udpSocket");
var readerMessageReceiver_1 = require("../socketMessage/useCases/readerMessageReceiver");
var logger_1 = require("../../helpers/logger");
var CircularArray = /** @class */ (function () {
    function CircularArray(array) {
        this.array = array;
        this.i = 0;
    }
    CircularArray.prototype.push = function (item) {
        this.array.push(item);
    };
    CircularArray.prototype.next = function () {
        var item = this.array[this.i];
        this.i = ((this.i + 1) === this.array.length ? 0 : this.i + 1);
        return item;
    };
    return CircularArray;
}());
var JobHandler = /** @class */ (function () {
    function JobHandler(_a) {
        var maxPoolSize = _a.maxPoolSize, writerPorts = _a.writerPorts;
        this.jobPool = new pool_1.Pool({ maxPoolSize: maxPoolSize });
        this.writerPorts = new CircularArray(writerPorts);
        this.clients = new CircularArray([]);
        for (var clientCount = 0; clientCount < maxPoolSize; clientCount++) {
            var client = udpSocket_1.UDPSocket.create({ messageReceiver: new readerMessageReceiver_1.ReaderMessageReceiver(this), timeout: 120000 });
            this.clients.push(client);
        }
    }
    JobHandler.prototype.add = function (job) {
        this.jobPool.add(job);
    };
    JobHandler.prototype.runJobs = function () {
        while (this.jobPool.canAllocate()) {
            var job = this.jobPool.allocate();
            if (!job) {
                throw new Error("No job found.");
            }
            this.start(job);
        }
    };
    JobHandler.prototype.start = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout, port;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeout = 100;
                        setTimeout(function () { _this.markIncomplete(job.id); }, timeout);
                        port = this.writerPorts.next();
                        logger_1.Logger.log("Sending data to port " + port);
                        return [4 /*yield*/, job.execute(this.clients.next(), port)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JobHandler.prototype.isFinished = function () {
        return this.jobPool.size === 0;
    };
    JobHandler.prototype.markComplete = function (id) {
        this.jobPool.delete(id);
    };
    JobHandler.prototype.markIncomplete = function (id) {
        if (!this.jobPool.isActive(id)) {
            return;
        }
        this.jobPool.deactivateElement(id);
    };
    return JobHandler;
}());
exports.JobHandler = JobHandler;
