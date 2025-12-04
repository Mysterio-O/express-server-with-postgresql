import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";


// roles = ['admin', 'user']
const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(403).json({ message: "unauthorized access" })
            }
            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
            console.log(decoded)
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    success: "false",
                    message: "access forbidden"
                })
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "internal server error"
            })
        }
    }
};

export default auth;