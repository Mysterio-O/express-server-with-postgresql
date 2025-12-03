import { pool } from "../../config/db"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../../config";

const loginUser = async ({ email, password }: { email: string, password: string }) => {
    console.log('from services',email,password)
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email]);

    if (result.rowCount === 0) {
        return null;
    }

    const user = result.rows[0];

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        return null;
    };


    const token = jwt.sign({ name: user.name, email: user.email }, config.jwt_secret as string, {
        expiresIn: "7d"
    });

    console.log(token);

    return {
        success:true,
        token,
        user
    }

}


export const authServices = {
    loginUser
}