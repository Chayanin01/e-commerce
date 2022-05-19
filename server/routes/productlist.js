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




//show data product all
app.get('/product', (req, res) => {
    dbCon.query('SELECT a.product_id,a.product_name,a.size_id,b.size_name,a.category_id,c.category_name,a.gender_id,d.gender_name,a.price,a.count FROM product a JOIN product_size b ON a.size_id = b.size_id JOIN product_type c ON a.category_id = c.category_id JOIN gender d ON a.gender_id = d.gender_id',
        (error, results, fields) => {
            if (error) {
                console.log(error);
                return res.status(400).send();
            }
            /*let message = ""
            if (results === undefined || results.length == 0) {
                message = "product table is empty";
            } else {
                message = "Successfully retrieved all product";
            }*/
            //return res.send({ error: false, data: results, message: message });
            return res.json(results);
        })
})

//Filter product with Gender, Category ,Size
app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id" });
    } else {
        dbCon.query(`SELECT a.product_id,a.product_name,a.size_id,b.size_name,a.category_id,c.category_name,a.gender_id,d.gender_name,a.price,a.count FROM product a 
        JOIN product_size b ON a.size_id = b.size_id 
        JOIN product_type c ON a.category_id = c.category_id 
        JOIN gender d ON a.gender_id = d.gender_id 
        WHERE  d.gender_name = '${id}' or c.category_name = '${id}' or b.size_name = '${id}'`,
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send();
                }
                /*let message = ""
                if (results === undefined || results.length == 0) {
                    message = "product table is empty";
                } else {
                    message = "Successfully retrieved all product";
                }*/
                //return res.send({ error: false, data: results, message: message });

                return res.json(results)
            })
    }
})


//Filter product with number
app.get('/countproduct/:number', (req, res) => {
    let number = req.params.number;
    if (!number) {
        return res.status(400).send({ error: true, message: "Please provide book id" });
    } else {
        dbCon.query(`SELECT a.product_id,a.product_name,a.size_id,b.size_name,a.category_id,c.category_name,
        a.gender_id,d.gender_name,a.price,a.count FROM product a 
        JOIN product_size b ON a.size_id = b.size_id 
        JOIN product_type c ON a.category_id = c.category_id 
        JOIN gender d ON a.gender_id = d.gender_id LIMIT ${number} `,
            (error, results, fields) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send();
                }

                /*let message = "";
                if (results === undefined || results.length == 0) {
                    message = "product not found";
                } else {
                    message = "Successfully retrieved product data";
                }
                */
                return res.json(results)
            })
    }
})

//insert data product
app.post('/product/create', (req, res) => {
    const product_name = req.body.product_name;
    const size_id = req.body.size_id;
    const category_id = req.body.category_id;
    const price = req.body.price;
    const count = req.body.count;
    const gender_id = req.body.gender_id;

    dbCon.query(
        "INSERT INTO product (product_name,size_id,category_id,price,count,gender_id) VALUES (?,?,?,?,?,?)", [product_name, size_id, category_id, price, count, gender_id],
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


})


module.exports = app;