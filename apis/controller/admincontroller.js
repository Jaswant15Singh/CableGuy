const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'First',
    password: 'cdac',
    port: 5432,
});

const getAdmin = async (req, res) => {
    try {
        const result = await pool.query('select * from admin');
        res.json(result.rows);
    } catch (error) {
        res.json(error)
    }
}

const signupadmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await pool.query('select * from admin where email = $1', [email]);
        if (rows.length > 0) {
            return res.json({ message: "User exists with this email", success: false })
        }
        else {

            try {
                const { rows } = await pool.query('insert into admin (name,email,password) values ($1,$2,$3)', [name, email, password]);
                res.json({ message: "admin added successfully", success: true });

            } catch (error) {
                res.json(error)
            }
        }
    } catch (error) {
        res.json(error)
    }
}

const adminLogin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await pool.query('select * from admin where email = $1', [email]);
        if (rows.length < 1) {
            return res.json({ message: "User doesnt exists with this email id", success: false });
        }

        const admins = rows[0];
        if (admins.password !== password) {
            return res.json({ message: "password doesnt match", success: false });
        }

        const token = jwt.sign({ adminId: admins.id, email: admins.email, role: "admin" }, process.env.Secret_key);
        res.json({ message: "Logged in successfully", token, success: true })
    } catch (error) {
        res.json(error)
    }
}

const getSingleAdmin = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const { rows } = await pool.query('select * from admin where id = $1', [id]);
        if (rows.length < 1) {
            return res.json("admin doesnt exists");
        }

        res.json(rows[0])
    } catch (error) {
        res.json(error)

    }
}

const updateAdmin = async (req, res) => {
    const id = parseInt(req.params.id);
    const name = req.body.name;
    const { email } = req.body;
    try {
        const result = await pool.query('update admin set name = $1,email = $2 where id = $3 returning *', [name, email, id]);
        if (result.rowCount < 1) {
            res.json({ message: "Admin doesnt exists", success: false })
        }

        // res.json({ message: "Admin updated successfully",data:result.rows[0]});
        res.json({ message: "Admin updated successfully", data: result.rows[0] });

    } catch (error) {
        res.json(error);
    }
}

const deleteAdmin = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query('delete from admin where id = $1', [id]);
        if (result.rowCount > 0) {
            return res.json({ message: "Deleted Successfully", success: true });
        }

        else {
            res.json({ message: "Admin doesnt exists", success: false })
        }
    } catch (error) {
        res.json(error)
    }
}


const getSupplier = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from supplier');
        res.json({ data: rows, success: true })
    } catch (error) {
        res.json({ message: "failed", success: false })
    }
}

const addSupplier = async (req, res) => {
    const { name, contact, address } = req.body;
    try {
        const { rows } = await pool.query('insert into supplier (name,contact,address) values ($1,$2,$3)', [name, contact, address]);
        res.json({ message: "supplier has been added", success: true });
    } catch (error) {
        res.json({ message: "failed to add supplier", success: false })

    }
}

const createProduct = async (req, res) => {
    const { name, description, category, price, supp_id } = req.body;

    try {
        const { rows } = await pool.query('insert into product (name,description,category,price,supp_id) values ($1,$2,$3,$4,$5)', [name, description, category, price, supp_id]);

        res.json({ message: "product added successfully", success: true, data: rows[0] });

    } catch (error) {
        res.json({ message: "failed to add data", success: false })
    }

}

const createBatch = async (req, res) => {
    const { product_id, batche_no, quantity, manufactured } = req.body;

    try {
        const { rows } = await pool.query(
            'INSERT INTO batch (product_id, batche_no, quantity, manufactured) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_id, batche_no, quantity, manufactured]
        );

        res.json({ message: "Batch created successfully", success: true, data: rows[0] });
    } catch (error) {
        console.error("Error creating batch:", error); // Log error for debugging
        res.json({ message: "Failed to create batch", success: false });
    }
};


const prodBySupplier = async (req, res) => {
    const { supp_id } = req.body;
    try {
        const { rows } = await pool.query('select s.name,s.address,p.name,p.price,p.category from supplier s inner join product p on s.id=p.supp_id', []);
        res.json(rows)
    } catch (error) {
        res.json({ message: "failed", success: false })

    }
}
const getProdBatch = async (req, res) => {
    const { batche_no } = req.body;
    try {
        const { rows } = await pool.query('select batch.batche_no,batch.quantity,product.name,product.description,product.category,product.price from batch inner join product on batch.product_id = product.id where batche_no = $1', [batche_no]);
        if (rows.length === 0) {
            return res.json({ message: "No batches found", success: false });
        }

        res.json({ message: rows, success: true });
    } catch (error) {
        res.json({ message: "failed", success: false })
    }
}


const placeOrder=async(req,res)=>{
    const { customerName, customerContact, cart } = req.body;
    const result=await pool.query('insert into orders (customerName, customerContact) values ($1,$2) returning order_id',[customerName,customerContact])
    const orderId=result.rows[0].order_id;

    for(const product of cart){
        const {id,quantity}=product;
        const ress=await pool.query('select price,quantity from product where id= $1',[id]);
        if(ress.rows.length<1){
            res.json({message:"Product not found for id",success:false})
        }

        const prod_price=ress.rows[0].price;
        const prod_quant=ress.rows[0].quantity;

        if(prod_quant>=quantity){
            await pool.query('insert into order_items (orderId,id,prod_price,prod_quant) values ($1,$2,$3,$4)',[orderId,id,prod_price,prod_quant]);
            await pool.query('update product set quantity = quantity - $1 where id = $2',[quantity,id]);
        }
        else{
            res.json({message:"Not in stock",success:false})
 
        }
    }
}

const sales=async(req,res)=>{
    const{name,prod_id,contact,email_cust,address,quantity}=req.body;
}

module.exports = { getAdmin, signupadmin, adminLogin, getSingleAdmin, updateAdmin, deleteAdmin, createProduct, createBatch, getProdBatch, getSupplier, addSupplier, prodBySupplier ,placeOrder};