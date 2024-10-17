const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'First',
    password: 'cdac',
    port: 5432,
});

const getAlluser = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await pool.query('select * from users where email = $1', [email]);
        if (rows.length > 0) {
            return res.json({ message: "User exists with this email", success: false })
        }
        else {

            try {
                const { rows } = await pool.query('insert into users (name,email,password) values ($1,$2,$3)', [name, email, password]);
                res.json({ message: "Registered successfully", success: true });

            } catch (error) {
                res.json(error)
            }
        }
    } catch (error) {
        res.json(error)
    }

}

const login = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await pool.query('select * from users where email = $1', [email]);
        if (rows.length < 1) {
            return res.json({ message: "User doesnt exists with this email id", success: false });
        }

        const users = rows[0];
        if (users.password !== password) {
            return res.json({ message: "password doesnt match", success: false });
        }

        const token = jwt.sign({ userId: users.id,name:users.name, email: users.email, role: "user" }, process.env.Secret_key);
        res.status(200).json({ success: true, message: "Logged in successfully", token })
    } catch (error) {
        res.json(error)
    }
}
const getSingleUser = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const { rows } = await pool.query(`select * from users where id=$1`, [id]);
        if (rows.length < 1) {
            return res.json({ message: "No user found", success: false })
        }

        else {
            res.json({ data: rows[0], success: true });

        }
    } catch (error) {
        res.json(error)
    }

}

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    try {
        const { rowCount } = await pool.query('update users set name = $1,email =$2 where id = $3 returning *', [name, email, id])
        if (rowCount > 0) {
            res.json({message:"updated",success:true})
        }
        else {
            res.json({message:"no user found",success:false})
        }
    } catch (error) {
        res.json(error)
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const { rowCount } = await pool.query('delete from users where id = $1', [id]);
        if (rowCount > 0) {
            return res.json({message:"deleted successfully",success:true});
        }
        else {
            res.json({message:"user not found",success:false})
        }
    } catch (error) {
        res.json(error)
    }
}

module.exports = { getAlluser, signup, login, getSingleUser, updateUser, deleteUser };