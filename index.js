import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import urlRoutes from "./src/routes/urlRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();
const app= express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("URL Shortener API - visit /auth/register or /auth/login to get started");
})

app.use('/auth',authRoutes);
app.use('/url',urlRoutes);

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});

pool.connect()
.then(()=>{
    console.log("Postgresql connected successfully");
})
.catch((err)=>{
    console.log("Postgresql not connected",err);
});