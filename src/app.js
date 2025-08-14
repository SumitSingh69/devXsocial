const express = require('express');

const app = express();


app.get("/profile/:username", (req, res) => {
    console.log(req.params);
    res.send(req.params.username + " Profile page accessed");
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});