let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const { readdirSync } = require('fs')
let cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Route
// #1
// app.use('/api', require('./routes/api'))

// #2
readdirSync('./routes')
    .map((r) => app.use('/', require('./routes/' + r)))


app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;