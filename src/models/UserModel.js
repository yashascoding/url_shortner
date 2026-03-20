import pool from "../config/db.js";

const findUserByEmail=async(email)=>{
    const result=await pool.query("SELECT *FROM users  WHERE email=$1",[email]);
    return result.rows[0];
};

const CreateUser=async(email,password)=>{
    const result=await pool.query("INSERT INTO users(email,password)VALUES ($1,$2) RETURNING *",[email,password]);
    return result.rows[0]
};

export{findUserByEmail,CreateUser};