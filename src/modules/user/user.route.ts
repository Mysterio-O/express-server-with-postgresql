import express, { Request, Response } from 'express';
import { pool } from '../../config/db';

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    const { title, user_id } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO todos(title,user_id) VALUES($1, $2) RETURNING *
            `, [title, user_id]);

        console.log(result.rows, result.rowCount);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(201).json({
            success: true,
            message: "todo inserted successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        console.error("error adding todo", err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})


router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await pool.query(`SELECT * FROM users`);

        if (users.rowCount === 0) {
            return res.status(404).json({
                success: true,
                message: "users not found",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: "users found",
            data: users.rows
        })
    } catch (err: any) {
        console.error("error getting users", err);
        res.status(500).json({
            success: false,
            message: err.detail || 'internal server error'
        })
    }
})

export const userRoutes = router;