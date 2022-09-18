import {Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const SECRET_KEY ="thotrang";
export const auth = (req:any,res:Response,next:NextFunction) =>{
    
    let authorization = req.headers.authorization;
    
    if(!authorization){
        res.status(401).json({
            message:"you is anonymous"
        })
    }else{
        let accessToken = authorization.split(' ')[1];

        let token = accessToken.substring(1,(accessToken.length-1))
        jwt.verify(token,SECRET_KEY,(err:any,data:any)=>{

            if(err){
              
                res.status(401).json({
                    err:err,
                    message:'you is anonymous '
                })
            }else{       
                                                 
                req.decoded =data;
                next();
            }
        })
    }
}
