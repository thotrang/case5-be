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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const user_1 = require("../../model/user");
const auth_1 = require("../../middleware/auth");
class AuthController {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = req.body;
                if (validator_1.default.isEmpty(user.username)) {
                    res.status(404).json("please input username");
                }
                else {
                    let username = yield user_1.User.findOne({ username: user.username });
                    if (!username) {
                        if (validator_1.default.isEmpty(user.password)) {
                            res.status(404).json("please input password");
                        }
                        else {
                            let email = yield user_1.User.findOne({ email: user.email });
                            if (!email) {
                                if (validator_1.default.isEmpty(user.email)) {
                                    res.status(404).json("please input email");
                                }
                                else {
                                    if (!validator_1.default.isEmail(user.email)) {
                                        res
                                            .status(404)
                                            .json("wrong email... please in put email with validator xxx@xxx.xxx");
                                    }
                                    else {
                                        if (validator_1.default.isEmpty(user.name)) {
                                            res.status(404).json("please input name");
                                        }
                                        else {
                                            user.password = yield bcrypt_1.default.hash(user.password, 10);
                                            user = yield user_1.User.create(user);
                                            res.status(201).json(user);
                                        }
                                    }
                                }
                            }
                            else {
                                res.status(410).json("email was exitsted");
                            }
                        }
                    }
                    else {
                        res.status(411).json("username was exitsted");
                    }
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let loginForm = req.body;
                let user = yield user_1.User.findOne({
                    username: loginForm.username,
                });
                if (!user) {
                    res.status(404).json({
                        message: "username is not existed",
                    });
                }
                else {
                    let pass = user.password;
                    let comparePassword = yield bcrypt_1.default.compare(loginForm.password, pass);
                    if (!comparePassword) {
                        res.status(401).json({
                            message: "password is wrong",
                        });
                    }
                    else {
                        let payload = {
                            id: user._id,
                            username: user.username,
                        };
                        let token = jsonwebtoken_1.default.sign(payload, auth_1.SECRET_KEY, {
                            expiresIn: 36000,
                        });
                        res.status(201).json({
                            token: token,
                        });
                    }
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new AuthController();
