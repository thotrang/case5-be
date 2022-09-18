"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.SECRET_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET_KEY = "thotrang";
const auth = (req, res, next) => {
    let authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: "you is anonymous"
        });
    }
    else {
        let accessToken = authorization.split(' ')[1];
        let token = accessToken.substring(1, (accessToken.length - 1));
        jsonwebtoken_1.default.verify(token, exports.SECRET_KEY, (err, data) => {
            if (err) {
                res.status(401).json({
                    err: err,
                    message: 'you is anonymous '
                });
            }
            else {
                req.decoded = data;
                next();
            }
        });
    }
};
exports.auth = auth;
