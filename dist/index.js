"use strict";
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    let helloMessage = 'Hello Incubator!!!';
    res.send(helloMessage);
});
app.get('/mans', (req, res) => {
    let a = 'stupid mans';
    res.send(a);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
