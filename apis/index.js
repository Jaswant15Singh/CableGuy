const express = require("express");
const app = express();
const { Pool } = require('pg');
const Route = require("./routes/route");
const adminRoute = require("./routes/adminRoute");
const cors = require("cors");
const dotenv = require("dotenv").config();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'First',
    password: 'cdac',
    port: 5432,
});
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL', err);
    } else {
        console.log('Connected to PostgreSQL:', res.rows[0]);
    }
});


app.use('/api', Route);
app.use("/adminapi", adminRoute)


app.listen(5000, () => {
    console.log("connected");
    // console.log(process.env.Secret_key);

})