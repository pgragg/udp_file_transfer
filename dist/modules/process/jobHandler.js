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
var JobHandler = /** @class */ (function () {
    function JobHandler() {
        this.inactiveJobs = {};
        this.activeJobs = {};
        this.maxActiveJobs = 5;
    }
    JobHandler.prototype.add = function (job) {
        this.inactiveJobs[job.id] = job;
    };
    JobHandler.prototype.runJobs = function () {
        while (this.shouldRunMoreJobs) {
            var job = Object.values(this.inactiveJobs)[0];
            console.log("Running next job: " + job.id);
            this.start(job.id);
        }
    };
    Object.defineProperty(JobHandler.prototype, "shouldRunMoreJobs", {
        get: function () {
            console.log({ activeJobs: this.activeJobs });
            console.log({ inactiveJobs: this.inactiveJobs });
            return (Object.keys(this.activeJobs).length < this.maxActiveJobs) &&
                Object.keys(this.inactiveJobs).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    JobHandler.prototype.start = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // If this process times out, we have no way of marking the job inactive :/ 
                        this.markActive(id);
                        return [4 /*yield*/, this.getJob(id, this.activeJobs).execute()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JobHandler.prototype.getJob = function (id, jobPool) {
        if (jobPool === void 0) { jobPool = this.inactiveJobs; }
        var job = jobPool[id];
        if (!job) {
            throw new Error('Expected job but found none.');
        }
        return job;
    };
    JobHandler.prototype.markActive = function (id) {
        this.activeJobs[id] = this.getJob(id, this.inactiveJobs);
        delete this.inactiveJobs[id];
    };
    JobHandler.prototype.markComplete = function (id) {
        console.log('Mark complete ' + id);
        delete this.activeJobs[id];
    };
    return JobHandler;
}());
exports.JobHandler = JobHandler;
