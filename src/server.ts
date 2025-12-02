import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDB, { pool } from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.route';

const app = express()

const port = config.port


// initialize db
initDB()





app.use(express.json());
// app.use(express.urlencoded())  // for formdata parsing

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});


app.use("/users",userRoutes)


app.get("/users/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        console.log(user);

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "user found",
            data: user.rows[0]
        })
    } catch (err: any) {
        console.error('error getting user', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})

app.put("/users/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, id]);
        console.log(user);

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "user updated",
            data: user.rows[0]
        })
    } catch (err: any) {
        console.error('error getting user', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})

app.delete("/users/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
        console.log(user);

        if (user.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "user not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "user deleted",
            data: null
        })
    } catch (err: any) {
        console.error('error getting user', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})



// todos
app.post('/todos', logger, async (req: Request, res: Response) => {
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
});

app.get('/todos', logger, async (req: Request, res: Response) => {
    try {
        const todos = await pool.query(`SELECT * FROM todos`);

        if (todos.rowCount === 0) {
            return res.status(404).json({
                success: true,
                message: "todos not found",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: "todos found",
            data: todos.rows
        })
    } catch (err: any) {
        console.error("error getting todos", err);
        res.status(500).json({
            success: false,
            message: err.detail || 'internal server error'
        })
    }
});

app.get("/todos/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const todo = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
        console.log(todo);

        if (todo.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "todo not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "todo found",
            data: todo.rows[0]
        })
    } catch (err: any) {
        console.error('error getting todo', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})

app.put("/todos/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const todo = await pool.query(`UPDATE todos SET title=$1, description=$2 WHERE id=$3 RETURNING *`, [title, description, id]);
        console.log(todo);

        if (todo.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "todo not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "todo updated",
            data: todo.rows[0]
        })
    } catch (err: any) {
        console.error('error getting user', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})

app.delete("/todos/:id", logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const todo = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
        console.log(todo);

        if (todo.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "todo not found",
                data: {}
            })
        }

        res.status(200).json({
            success: true,
            message: "todo deleted",
            data: null
        })
    } catch (err: any) {
        console.error('error getting todo', err);
        res.status(500).json({
            success: false,
            message: err.detail || "internal server error"
        })
    }
})



app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "no route found",
        requested_path: req.path
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
