import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async(req:Request,res:Response)=> {
    console.log(req.body,'from controller')
    const {email,password}=req.body;
    if(!email||!password)return;

    const result = await authServices.loginUser({email,password});

    if(result?.success){
        res.status(200).json(result)
    }else{
        res.status(400).json({
            success:false,
            message:"failed to login"
        })
    }

};


export const authControllers = {
    loginUser
}