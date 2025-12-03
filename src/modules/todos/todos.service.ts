import { pool } from "../../config/db";

const createTodos = async (payload: Record<string, unknown>) => {

    const { title, user_id } = payload;

    const result = await pool.query(`
            INSERT INTO todos(title,user_id) VALUES($1, $2) RETURNING *
            `, [title, user_id]);
    return result;
};

const getTodos = async () => {
    const result = await pool.query(`SELECT * FROM todos`);
    return result;
}

const getSingleTodo = async (id: string) => {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
    return result;
}

const updateTodo = async ({ title, description, id }: { title: string, description?: string, id: string }) => {
    const result = await pool.query(`UPDATE todos SET title=$1, description=$2 WHERE id=$3 RETURNING *`, [title, description, id]);
    return result;
};


const deleteTodo = async (id: string) => {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
    return result;
}

export const todoServices = {
    createTodos,
    getTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
}