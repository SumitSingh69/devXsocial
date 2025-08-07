const express = require('express');

const app = express();

app.use("/profile12", (req, res, next) => {
    res.send('Profile middleware is working!');
})

app.use("/test", (req, res) => {
    res.send('Test endpoint is working!');
});

app.use("/profile",(req, res) =>{
    res.send('Profile endpoint is working!');
})
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});