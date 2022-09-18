import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import validator from "validator";

import { User } from "../../model/user";
import { SECRET_KEY } from "../../middleware/auth";

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {

    try {
      let user = req.body;
      if (validator.isEmpty(user.username)) {
        res.status(404).json("please input username");
      } else {
        let username = await User.findOne({ username: user.username });
        if (!username) {
          if (validator.isEmpty(user.password)) {
            res.status(404).json("please input password");
          } else {
            let email = await User.findOne({ email: user.email });
            if (!email) {
              if (validator.isEmpty(user.email)) {
                res.status(404).json("please input email");
              } else {
                if (!validator.isEmail(user.email)) {
                  res
                    .status(404)
                    .json(
                      "wrong email... please in put email with validator xxx@xxx.xxx"
                    );
                } else {
                  if (validator.isEmpty(user.name)) {
                    res.status(404).json("please input name");
                  } else {
                    user.password = await bcrypt.hash(user.password, 10);
                    user = await User.create(user);
                    res.status(201).json(user);
                  }
                }
              }
            } else {
              res.status(410).json("email was exitsted");
            }
          }
        } else {
          res.status(411).json("username was exitsted");
        }
      }
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let loginForm = req.body;
      let user = await User.findOne({
        username: loginForm.username,
      });

      if (!user) {
        res.status(404).json({
          message: "username is not existed",
        });
      } else {
        let pass: any = user.password;
        let comparePassword = await bcrypt.compare(loginForm.password, pass);

        if (!comparePassword) {

          res.status(401).json({
            message: "password is wrong",
          });
        } else {
          let payload = {
            id: user._id,
            username: user.username,
          };
          let token = jwt.sign(payload, SECRET_KEY, {
            expiresIn: 36000,
          });
          res.status(201).json({
            token: token,
          });
        }
      }
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
