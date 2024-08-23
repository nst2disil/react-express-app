const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
const csv = require('csv-parser');

const PORT = 8085;
const HOST = '127.0.0.1';
const COLUMNS_NUM = 5;


app.use(express.static(path.join(__dirname, '../frontend/build')));


app.get('/table', (req, res) => {
    const results = [];

    fs.createReadStream(__dirname + '/data.csv')
        .pipe(csv())
        .on('data', (data) => {
            const keys = Object.keys(data).slice(0, COLUMNS_NUM);
            const filteredData = keys.reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
            results.push(filteredData);
        })
        .on('end', () => {
            res.json(results);
        });
});


app.listen(PORT, () => {
    console.log(`Server started: http://${HOST}:${PORT}`)
})