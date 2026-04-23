import pool from "../config/db.js";

const generateShortCode=()=>{
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code='';
    for(let i=0;i<6;i++){
        code+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return code;
}

const findUrlByShortCode=async(short_code)=>{
    const result=await pool.query("SELECT * FROM urls WHERE short_code=$1",[short_code]);
    return result.rows[0];
}

const findUrlById=async(id)=>{
    const result=await pool.query("SELECT * FROM urls WHERE id=$1",[id]);
    return result.rows[0];
}

const createUrl=async(original_url,user_id,expiry_date=null)=>{
    let short_code=generateShortCode();
    let existing=await findUrlByShortCode(short_code);
    while(existing){
        short_code=generateShortCode();
        existing=await findUrlByShortCode(short_code);
    }
    const result=await pool.query(
        "INSERT INTO urls(original_url,short_code,user_id,expiry_date) VALUES ($1,$2,$3,$4) RETURNING *",
        [original_url,short_code,user_id,expiry_date]
    );
    return result.rows[0];
}

const getUrlsByUserId=async(user_id)=>{
    const result=await pool.query("SELECT * FROM urls WHERE user_id=$1 ORDER BY created_at DESC",[user_id]);
    return result.rows;
}

const deleteUrlById=async(id,user_id)=>{
    const result=await pool.query("DELETE FROM urls WHERE id=$1 AND user_id=$2 RETURNING *",[id,user_id]);
    return result.rows[0];
}

const incrementClickCount=async(short_code)=>{
    const result=await pool.query(
        "UPDATE urls SET click_count = click_count + 1 WHERE short_code=$1 RETURNING *",
        [short_code]
    );
    return result.rows[0];
}

export{findUrlByShortCode,findUrlById,createUrl,getUrlsByUserId,deleteUrlById,incrementClickCount};