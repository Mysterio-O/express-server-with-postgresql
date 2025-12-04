import express, { Request, Response } from 'express';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.route';
import { todoRoutes } from './modules/todos/todos.route';
import { authRoutes } from './modules/auth/auth.route';

const app = express()




// initialize db
initDB()





app.use(express.json());
// app.use(express.urlencoded())  // for formdata parsing

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});


// users
app.use("/users",userRoutes)


// todos
app.use('/todos',todoRoutes);


// auth routes
app.use("/auth",authRoutes);



app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "no route found",
        requested_path: req.path
    })
})

export default app;
