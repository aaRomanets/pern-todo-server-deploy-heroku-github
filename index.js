import dotenv from "dotenv";
dotenv.config();
import express from "express";

//определяем компонент cors с помощью которого будем отправлять необходимые запросы с клиент-приложения
import cors from "cors";

//external imports
import mongoose from "mongoose";

//вытаскиваем модель базы данных названий заданий
import Todo from "./model.js";

//подключаем базу данных Mongo DB
mongoose.connect(
    process.env.DB_URL,
    {
        //these are options to ensure that the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
)
.then(() => 
{
     console.log("Successfully connected to MongoDB Atlas!")        
})
.catch((error) => 
{
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
})  

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

//МАРШРУТИЗАТОРЫ//

//маршрутизатор запроса добавления в базу данных наваний заданий название нового задания
app.post("/todos", async(req,res) => 
{
    try 
    {
        //производим указанное добавление
        const doc = new Todo({
            description: req.body.description
        })
        //фиксируем новое задание в базе данных
        const newTodo = await  doc.save();
        res.json({
           db: process.env.DATABASE_URL,
           host: process.env.host,
        });
    } 
    catch (err) 
    {
        console.error(err.message);
    }
})

//маршрутизатор запроса на получение всех названий заданий из соответствующей базы данных
app.get("/todos", async (req,res) => 
{
    try
    {
       //определяем все названия заданий в базе данных Todo 
        const allTodos = await Todo.find().exec();
        //отправляем полученный результат на клиент приложение
        res.json({allTodos: allTodos});
    } 
    catch (err) 
    {
        console.error(err.message);
    }
})

//маршрутизатор запроса на изменение названия задания в соответствующей базе данных с определенным идентификатором
app.put("/todos/:id", async (req, res) => 
{
    try 
    {
        //получаем идентификатор изменяемого названия задания 
        const todoId = req.params.id;
        //производим указанное изменение
        await Todo.updateOne(
            {
                _id: todoId
            },
            {
                description: req.body.description
            }
        );
        res.json("Todo was updated!")
    } 
    catch (err) 
    {
        console.error(err.message);
    }
})

//маршрутизатор запроса на удаление названия задания с заданным идентификатором из соответствующей базы данных
app.delete("/todos/:id", async (req, res) => 
{
    try 
    {
        //определяем идентификатор удаляемого названия задания
        const todoId = req.params.id;
        //удаляем соответствующее название задания
        Todo.findOneAndDelete(
        {
             _id: todoId
        },
        (err, doc) => {
        //ошибка при удалении названия задания
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Could not get the todo'
            })
        }
        //название задания, которую нужно удалить не найдено
        if (!doc) {
            return res.status(404).json({
                message: 'Todo not found'
            })
        }
        //название задания, которую нужно удалить, удалено
        res.json("Todo was deleted!");
        }
        )
    } 
    catch (err) 
    {
        console.log(err.message);
    }
})

//функция подключения к базе данных postgress и запуска сервера
const start = async () => {
  try 
  {
    //прослушиваем сервер
    app.listen(port, () => console.log(`Server started on port ${port}`));
  }
  catch (e) 
  {
      console.log(e);
  }
} 

//активируем функцию подключения к базе данных postgress и запуска сервера
start();