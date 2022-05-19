let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e-commerce'
})
dbCon.connect();



//insert data order product 
app.post("/order/create", (req, res) => {
    const count_product = req.body.count_product;
    const date = req.body.date;
    const address = req.body.address;
    const product_id = req.body.product_id;
    const price = req.body.price;
    const status_id = req.body.status_id;

    dbCon.query(
        "INSERT INTO create_order (count_product,date, address,product_id,price,status_id) VALUES (?,?,?,?,?,?)", [count_product, date, address, product_id, price, status_id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send({
                    "status": "ok",
                });

            }
        }
    );
});


//Filter data status is paid by date
app.get("/order/status/:date", (req, res) => {
    let date = req.params.date;
    dbCon.query(`SELECT a.count_order_id,b.product_name,a.count_product,a.price,a.date,a.address,c.status_name FROM create_order a JOIN product b ON a.product_id = b.product_id JOIN status c ON a.status_id = c.status_id where a.status_id=1 and a.date like '%${date}%' ORDER by a.count_order_id`,
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(400).send();
            }
            let message = ""
            if (results === undefined || results.length == 0) {
                message = "product table is empty";
            } else {
                message = "Successfully retrieved all product";
            }
            //return res.send({ error: false, data: results, message: message });
            return res.json(results);

        })
})



//Filter data order by status
app.get("/order/:status", (req, res) => {
    let status = req.params.status;
    dbCon.query("SELECT a.count_order_id,b.product_name,a.count_product,a.price,a.date,a.address,c.status_name FROM create_order a JOIN product b ON a.product_id = b.product_id JOIN status c ON a.status_id = c.status_id WHERE c.status_name = ?  ORDER by a.count_order_id", [status],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(400).send();
            }
            /* let message = ""
             if (results === undefined || results.length == 0) {
                 message = "product table is empty";
             } else {
                 message = "Successfully retrieved all product";
             }*/
            //return res.send({ error: false, data: results, message: message });
            return res.json(results);

        })
})


//show data by number
app.get('/countorder/:number', (req, res) => {
    let number = req.params.number;
    if (!number) {
        return res.status(400).send({ error: true, message: "Please provide book id" });
    } else {
        dbCon.query(`SELECT a.count_order_id,b.product_name,a.count_product,a.price,a.date,a.address,c.status_name FROM create_order a JOIN product b ON a.product_id = b.product_id JOIN status c ON a.status_id = c.status_id  ORDER by a.count_order_id LIMIT ${number} `,
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send();
                }
                return res.json(results)
            })
    }
})

module.exports = app;