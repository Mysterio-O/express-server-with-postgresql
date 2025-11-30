import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import path from 'path';
const app = express()
const port = 5000;
dotenv.config({path:path.join(process.cwd(),'.env')});

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
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
