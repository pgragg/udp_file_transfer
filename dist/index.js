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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var udpSocket_1 = require("./entities/udpSocket");
var message_1 = require("./entities/message");
var fs_1 = __importDefault(require("fs"));
var stream_1 = __importDefault(require("stream"));
var socketMessageReceiver_1 = require("./modules/socketMessage/useCases/socketMessageReceiver");
var readFile = function (filepath) { return __awaiter(_this, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Reading filepath " + filepath);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs_1.default.readFile(filepath, {}, function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            resolve(data);
                        });
                    })];
            case 1:
                file = _a.sent();
                return [2 /*return*/, file];
        }
    });
}); };
var clientMessageCallback = function (msg, info, socket) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
};
var duplicateFile = function (_a) {
    var port = _a.port, fileName = _a.fileName, targetFileName = _a.targetFileName, startByte = _a.startByte, endByte = _a.endByte;
    return __awaiter(_this, void 0, void 0, function () {
        var timeout, client, file, buffer, writable;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    timeout = 5000;
                    udpSocket_1.UDPSocket.create({ port: port, timeout: timeout, messageReceiver: new socketMessageReceiver_1.SocketMessageReceiver(targetFileName) });
                    client = udpSocket_1.UDPSocket.create({ timeout: timeout, messageReceiver: { receiveMessage: clientMessageCallback } });
                    return [4 /*yield*/, readFile(fileName)];
                case 1:
                    file = _b.sent();
                    console.log({ file: file });
                    buffer = [];
                    writable = new stream_1.default.Writable({
                        write: function (chunk, encoding, next) {
                            console.log({ chunk: chunk });
                            buffer.push(chunk);
                            next();
                        }
                    });
                    fs_1.default.createReadStream(fileName, { start: startByte, end: endByte })
                        .pipe(writable);
                    writable.on('finish', function () {
                        var message = new message_1.Message(new message_1.Document({ startByte: startByte, endByte: endByte, data: buffer.join('') })).toString();
                        client.send(message, port, 'localhost', function (error) {
                            if (error) {
                                client.close();
                            }
                            else {
                                console.log("Data sent to port " + port);
                            }
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
};
if (!module.parent) {
    // Create n processes at once to read k bytes from the fileName 
    // send a Message as follows: 
    // {
    //   meta: {
    //     startByte: 0,
    //     endByte: 10,
    //     checksum: checksum
    //   },
    //   data: data
    // }
    // The server will receive the Message and verify the checksum 
    // if the checksum does not pass, the server will respond with a failure message
    // if the checksum does pass, the server will respond with a success message.
    duplicateFile({ port: 2222, fileName: './src/files/typescript.pdf', targetFileName: './src/files/typescript2.pdf', startByte: 0, endByte: 10 }).then(function () {
        console.log("Done");
    });
}
