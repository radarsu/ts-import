"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
exports.tsImport = exports.Compiler = void 0;
var childProcess = require("child_process");
var fs = require("fs");
var path = require("path");
var utils_1 = require("./utils");
var options_defaults_1 = require("options-defaults");
var Compiler = /** @class */ (function () {
    function Compiler(options) {
        // Support setting rootDir and outDir on windows from different drives based process.cwd().
        if (process.platform === "win32") {
            var driveLetter = process.cwd().charAt(0);
            Compiler.defaults.compilerOptions.outDir = path.resolve(Compiler.defaults.compilerOptions.outDir, driveLetter);
            Compiler.defaults.compilerOptions.rootDir = "".concat(driveLetter, ":/");
        }
        this.options = (0, options_defaults_1.defaults)(Compiler.defaults, options);
    }
    /**
     * Compile scripts.ts to scripts.js, check cache.
     */
    Compiler.prototype.compile = function (relativeTsPath, cwd) {
        if (relativeTsPath === void 0) { relativeTsPath = ""; }
        if (cwd === void 0) { cwd = process.cwd(); }
        return __awaiter(this, void 0, void 0, function () {
            var tsPath, tsDir, ctx;
            return __generator(this, function (_a) {
                tsPath = path.resolve(cwd, relativeTsPath);
                if (!fs.existsSync(tsPath)) {
                    throw new Error("File ".concat(tsPath, " not found to compile."));
                }
                tsDir = path.dirname(tsPath);
                ctx = {
                    cwd: cwd,
                    tsPath: tsPath,
                    tsDir: tsDir
                };
                return [2 /*return*/, this.compileOrFail(ctx)];
            });
        });
    };
    Compiler.prototype.compileOrFail = function (ctx) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var logger, tsPath, tsDir, cwd, tsFileName, jsFileName, tsDirWithoutDriveLetter, cacheDir, jsPath, tsWasModified, buildError;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        logger = this.options.logger;
                        tsPath = ctx.tsPath, tsDir = ctx.tsDir, cwd = ctx.cwd;
                        tsFileName = path.basename(tsPath);
                        jsFileName = tsFileName.replace(/\.[^/.]+$/u, ".js");
                        tsDirWithoutDriveLetter = tsDir.replace(/^(?<driveLetter>[a-zA-Z]):/u, "");
                        cacheDir = path.resolve(this.options.compilerOptions.outDir, ".".concat(tsDirWithoutDriveLetter));
                        jsPath = path.resolve(cacheDir, jsFileName);
                        (_a = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _a === void 0 ? void 0 : _a.call(logger, "Looking for cached file at ".concat(jsPath));
                        if (!fs.existsSync(jsPath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utils_1.wasFileModified)(tsPath, jsPath)];
                    case 1:
                        tsWasModified = _h.sent();
                        if (!tsWasModified) {
                            (_b = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _b === void 0 ? void 0 : _b.call(logger, "File ".concat(tsPath, " was not modified, importing."));
                            return [2 /*return*/, (0, utils_1.importJsInDirectory)(cwd, jsPath, tsDir)];
                        }
                        // Cache is incorrect, rebuild.
                        (_c = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _c === void 0 ? void 0 : _c.call(logger, "File was modified, building and importing.");
                        return [4 /*yield*/, this.buildCache(tsPath)["catch"](function (err) {
                                var _a, _b;
                                (_a = logger === null || logger === void 0 ? void 0 : logger.warn) === null || _a === void 0 ? void 0 : _a.call(logger, "Building ".concat(tsPath, " failed."));
                                (_b = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _b === void 0 ? void 0 : _b.call(logger, err);
                                return err;
                            })];
                    case 2:
                        buildError = _h.sent();
                        // If we don't want to fallback to last working version of compiled file, throw error.
                        if (!this.options.fallback && buildError instanceof Error) {
                            throw buildError;
                        }
                        (_d = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _d === void 0 ? void 0 : _d.call(logger, "Caching successfull.");
                        return [2 /*return*/, (0, utils_1.importJsInDirectory)(cwd, jsPath, tsDir)];
                    case 3:
                        // Create cache directory if it does not exist.
                        if (!fs.existsSync(cacheDir)) {
                            (_e = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _e === void 0 ? void 0 : _e.call(logger, "Creating cache directory.");
                            fs.mkdirSync(cacheDir, {
                                recursive: true
                            });
                        }
                        // Build cache.
                        (_f = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _f === void 0 ? void 0 : _f.call(logger, "File was not cached, caching...");
                        return [4 /*yield*/, this.buildCache(tsPath)];
                    case 4:
                        _h.sent();
                        (_g = logger === null || logger === void 0 ? void 0 : logger.verbose) === null || _g === void 0 ? void 0 : _g.call(logger, "Caching successfull.");
                        return [2 /*return*/, (0, utils_1.importJsInDirectory)(cwd, jsPath, tsDir)];
                }
            });
        });
    };
    Compiler.prototype.buildCache = function (absoluteTsPath) {
        return __awaiter(this, void 0, void 0, function () {
            var logger, tmpTsConfigPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger = this.options.logger;
                        tmpTsConfigPath = path.join(this.options.compilerOptions.outDir, path.dirname(absoluteTsPath).replace(/^(?<driveLetter>[a-zA-Z]):/u, ""), "tsconfig-".concat(path.basename(absoluteTsPath), ".tmp.json"));
                        return [4 /*yield*/, fs.promises.writeFile(tmpTsConfigPath, JSON.stringify({
                                compilerOptions: this.options.compilerOptions,
                                include: [absoluteTsPath]
                            }, undefined, 4))];
                    case 1:
                        _a.sent();
                        // Compile new scripts.ts to .js.
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var _a, _b;
                                var compileCommand = "npx -p typescript tsc --project \"".concat(tmpTsConfigPath, "\"");
                                (_a = logger === null || logger === void 0 ? void 0 : logger.info) === null || _a === void 0 ? void 0 : _a.call(logger, "Compiling ".concat(absoluteTsPath));
                                (_b = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _b === void 0 ? void 0 : _b.call(logger, "Command: ".concat(compileCommand));
                                childProcess.exec(compileCommand, function (err, stdout, stderr) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                if (!err) return [3 /*break*/, 2];
                                                (_a = logger === null || logger === void 0 ? void 0 : logger.error) === null || _a === void 0 ? void 0 : _a.call(logger, err);
                                                return [4 /*yield*/, fs.promises.rm(tmpTsConfigPath)];
                                            case 1:
                                                _d.sent();
                                                reject(err);
                                                return [2 /*return*/];
                                            case 2:
                                                if (stdout.trim()) {
                                                    (_b = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _b === void 0 ? void 0 : _b.call(logger, stdout);
                                                }
                                                if (stderr.trim()) {
                                                    (_c = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _c === void 0 ? void 0 : _c.call(logger, stderr);
                                                }
                                                return [4 /*yield*/, fs.promises.rm(tmpTsConfigPath)];
                                            case 3:
                                                _d.sent();
                                                resolve(stdout);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                }
            });
        });
    };
    Compiler.defaults = {
        fallback: false,
        compilerOptions: {
            downlevelIteration: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            module: "commonjs",
            outDir: path.resolve(__dirname, "../cache"),
            resolveJsonModule: true,
            rootDir: "/",
            skipLibCheck: true,
            target: "es2015"
        }
    };
    return Compiler;
}());
exports.Compiler = Compiler;
exports.tsImport = new Compiler();
