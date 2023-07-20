const express = require('express');
const app= express();
const db= require('./config/mongoose')
const  cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());



app.get('/', (req,res)=>{
    res.send("Hello World!");
})


app.use('/api/v1/admin', require('./routes/index'));
app.use('/api/v1/task', require('./routes/taskRoutes'))
app.listen(2000, (error)=>{
    if(error){
        console.log("Server",error.message);
    }
    console.log("server start");
})