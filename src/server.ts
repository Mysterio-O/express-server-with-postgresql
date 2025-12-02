import express, { Request, Response } from 'express';
import config from './config';
import initDB from './config/db';
import { userRoutes } from './modules/user/user.route';
import { todoRoutes } from './modules/todos/todos.route';

const app = express()

const port = config.port


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
app.use('/todos',todoRoutes)



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
