import express from "express";//simple importing using module not common js
const app= express();//app object 

const PORT =3000

app.use(express.json());//middleware which is used to convert string data to json
app.use(express.urlencoded({extended:true}));//middlware converts urlencoded data into json data 

app.get('/',(req,res)=>{
    res.send("Hello world")
})
//this is a get request

app.listen(PORT,()=>{
    console.log("Server is runnig at port 3000")
})
// this listens to the port 3000
