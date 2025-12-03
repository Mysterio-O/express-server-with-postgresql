import { Request, Response } from "express";
import { todoServices } from "./todos.service";

const createTodo = async (req: Request, res: Response) => {
    const { title, user_id } = req.body;
    try {
        const result = await todoServices.createTodos({ title, user_id })

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
};

const getTodos = async (req: Request, res: Response) => {
    try {
        const todos = await todoServices.getTodos();

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
};

const getSingleTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return;
    try {
        const todo = await todoServices.getSingleTodo(id)
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
};

const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id) return;

    let data: any = {
        id
    }

    if (title) data.title = title;
    if (description) data.description = description;

    try {
        const todo = await todoServices.updateTodo(data)
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
};

const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return;
    try {
        const todo = await todoServices.deleteTodo(id);
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
}


export const todoControllers = {
    createTodo,
    getTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
}