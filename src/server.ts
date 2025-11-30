import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import path from 'path';
const app = express()
const port = 5000;
dotenv.config({ path: path.join(process.cwd(), '.env') });

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STRING}`
});

const initDB = async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100),
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
};

initDB()

app.use(express.json());
// app.use(express.urlencoded())  // for formdata parsing

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});



app.post('/users', async (req: Request, res: Response) => {
    const { name, email } = req.body;
    try {
        const result = await pool.query(`
            INSERT INTO users(name,email) VALUES($1, $2) RETURNING *
            `, [name, email]);

        console.log(result.rows, result.rowCount);
        res.status(201).json({
            success: true,
            message: "user inserted successfully",
            data: result.rows[0]
        })
    } catch (err: any) {
        console.error("error adding user", err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
});

app.get('/users', async (req: Request, res: Response) => {
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
});

app.get("/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await pool.query(`SELECT * FROM users WHERE id = $1`,[id]);
        console.log(user);

        if(user.rowCount === 0){
            return res.status(404).json({
            success:false,
            message:"user not found",
            data:{}
        })
        }

        res.status(200).json({
            success:true,
            message:"user found",
            data:user.rows[0]
        })
    } catch (err: any) {
        console.error('error getting user', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
