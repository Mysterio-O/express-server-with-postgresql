import { pool } from "../../config/db"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

    const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

    const token = jwt.sign({ name: user.name, email: user.email }, secret, {
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