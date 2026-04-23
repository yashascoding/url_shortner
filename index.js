import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import urlRoutes from "./src/routes/urlRoutes.js";

dotenv.config();
const app= express();

const PORT =3000

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.use('/auth',authRoutes);
app.use('/url',urlRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})

pool.connect()
.then(()=>{
    console.log("Postgres sql connected successfully");
})
.catch(
    (err)=>{
         console.log("Postgres sql not connected",err);
    }
);