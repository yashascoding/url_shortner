import pool from "../config/db.js";

const findUserByEmail=async(email)=>{
    const result=await pool.query("SELECT *FROM users  WHERE email=$1",[email]);
    return result.rows[0];
};

const CreateUser=async(email,password_hash)=>{
    const result=await pool.query("INSERT INTO users(email,password_hash)VALUES ($1,$2) RETURNING *",[email,password_hash]);
    return result.rows[0]
};

export{findUserByEmail,CreateUser};