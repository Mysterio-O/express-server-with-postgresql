import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUser(req.body)

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

const getUser = async (req: Request, res: Response) => {
    try {
        const users = await userServices.getUser();

        if (users.rowCount === 0) {
            return res.status(404).json({
                success: true,
                message: "users not found",
                data: []
            })
        }

        res.status(200).json({
            success: true,
            count: users.rowCount,
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
}


const getSingleUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return;
    try {
        const user = await userServices.getSingleUser(id)
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
};


const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!id || !email || !name) return;

    try {
        const user = await userServices.updateUser({ name, email, id })
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
};


const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return;
    try {
        const user = await userServices.deleteUser(id)
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
}

export const userControllers = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}