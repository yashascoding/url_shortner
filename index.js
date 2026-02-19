import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

dotenv.config();
const app= express();//app object 

const PORT =3000

app.use(express.json());//middleware which is used to convert string data to json
app.use(express.urlencoded({extended:true}));//middlware converts urlencoded data into json data 

app.get('/',(req,res)=>{
    res.send("Hello world")
})

app.listen(PORT,()=>{
    console.log("Server is runnig at port 3000")
})

//database connection------------------------------------------
pool.connect()
.then(()=>{
    console.log("Postgres sql connected succesfully");
})
.catch(
    (err)=>{
         console.log("Postgres sql not connected",err);
    }
);
//-------------------------------------------------------------------
