const express = require('express');

const app = express();


app.use("/problems",[(req, res, next)=>{
    // res.send("Hello from problems route!");
    next();
},[(req, res, next)=>{
    res.send("this is the second route handler in problems route!");//connection already closed you cannot send the response again
    next();
}]])

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});