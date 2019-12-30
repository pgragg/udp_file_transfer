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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var writerMessageReceiver_1 = require("../socketMessage/useCases/writerMessageReceiver");
var udpSocket_1 = require("../../entities/udpSocket");
var logger_1 = require("../../helpers/logger");
var statistics_1 = require("../statistics/statistics");
var cli_progress_1 = require("cli-progress");
var cli_progress_2 = require("cli-progress");
var View = /** @class */ (function () {
    function View(statistics) {
        this.statistics = statistics;
        this.bar = new cli_progress_1.SingleBar({}, cli_progress_2.Presets.shades_classic);
        this.bar.start(statistics.totalBytes, statistics.successfulBytes);
    }
    View.prototype.render = function () {
        this.bar.setTotal(this.statistics.totalBytes);
        this.bar.update(this.statistics.successfulBytes);
        // this.bar.stop if successfulBytes == totalBytes.
    };
    return View;
}());
exports.write = function (_a) {
    var ports = _a.ports, targetFileName = _a.targetFileName, timeout = _a.timeout;
    return __awaiter(_this, void 0, void 0, function () {
        var statistics_2, view_1;
        return __generator(this, function (_b) {
            try {
                statistics_2 = new statistics_1.Statistics();
                view_1 = new View(statistics_2);
                setInterval(function () {
                    view_1.render();
                    console.log({ statistics: statistics_2 });
                }, 1000);
                return [2 /*return*/, ports.map(function (port) {
                        return udpSocket_1.UDPSocket.create({ port: port, timeout: timeout, messageReceiver: new writerMessageReceiver_1.WriterMessageReceiver(targetFileName, statistics_2) });
                    })];
            }
            catch (error) {
                logger_1.Logger.log({ error: error });
            }
            return [2 /*return*/];
        });
    });
};
