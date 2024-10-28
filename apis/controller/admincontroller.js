const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'First',
    password: 'cdac',
    port: 5432,
});

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const multipleUpload = upload.fields([
    { name: 'products[0][image]', maxCount: 1 },
    { name: 'products[1][image]', maxCount: 1 },
    { name: 'products[2][image]', maxCount: 1 }
    // Add more fields as per your needs
]);
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

        const token = jwt.sign({ adminId: admins.id, name: admins.name, email: admins.email, role: "admin" }, process.env.Secret_key);
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
        const { rows } = await pool.query('insert into product (name,description,category,price,supp_id,image) values ($1,$2,$3,$4,$5)', [name, description, category, price, supp_id,]);

        res.json({ message: "product added successfully", success: true, data: rows[0] });

    } catch (error) {
        res.json({ message: "failed to add data", success: false })
    }

}

const getProducts = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from product');
        res.json({ data: rows, success: true })
    } catch (error) {
        res.json({ message: "failed to fetch products", success: false })

    }
}

const createBatch = async (req, res) => {
    const { product_id, batche_no, batch_quantity, manufactured } = req.body;

    try {
        const { rows } = await pool.query(
            'INSERT INTO batch (product_id, batche_no, batch_quantity, manufactured) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_id, batche_no, batch_quantity, manufactured]
        );

        res.json({ message: "Batch created successfully", success: true, data: rows[0] });
    } catch (error) {
        console.error("Error creating batch:", error);
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
        const { rows } = await pool.query('select batch.batche_no,batch.batch_quantity,product.name,product.description,product.category,product.price from batch inner join product on batch.product_id = product.id');
        // const {rows}=await pool.query('select * from batch');
        if (rows.length === 0) {
            return res.json({ message: [], success: false });
        }
        res.json({ message: rows, success: true });
    } catch (error) {
        res.json({ message: "failed", success: false })
    }
}


const getIndProd = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from ref_products')
        res.json({ data: rows })
    } catch (error) {
        res.json(error)
    }
}

const addIndProduct = async (req, res) => {
    const { name, description, category } = req.body;
    const imagePath = req.file ? req.file.path : null;

    try {
        const { rows } = await pool.query(
            'INSERT INTO ref_products (name, description, category, image) VALUES ($1, $2, $3,$4) RETURNING *',
            [name, description, category, imagePath]
        );
        // console.log(req.file);

        res.json({ message: "Product added successfully", success: true, data: rows[0] });
    } catch (error) {
        console.log(error.message);
        res.json({ message: "Failed to add product", success: false });
    }
};



// const createProductsWithBatch = async (req, res) => {
//     const { supp_id, products } = req.body;


//     try {
//         const supplierCheck = await pool.query('SELECT * FROM supplier WHERE id = $1', [supp_id]);
//         if (supplierCheck.rows.length === 0) {
//             return res.json({ message: "Supplier not found", success: false });
//         }

//         const createdProducts = [];

//         const batchNoResult = await pool.query('SELECT MAX(batche_no) AS max_batch_no FROM batch');
//         const maxBatchNo = batchNoResult.rows[0].max_batch_no || 0;
//         const newBatchNo = maxBatchNo + 1;

//         for (const product of products) {
//             const { name, description, category, price, batch_quantity, manufactured, received_data } = product;
//             const imagePath = req.file ? req.file.path : null;


//             // const existingRefProduct = await pool.query(
//             //     'SELECT * FROM ref_products WHERE name = $1 AND description = $2 AND category = $3',
//             //     [name, description, category]
//             // );

//             let distProductId;

//             // if (existingRefProduct.rows.length === 0) {
//             //     const refProductResult = await pool.query(
//             //         'INSERT INTO ref_products (name, description, category) VALUES ($1, $2, $3) RETURNING id',
//             //         [name, description, category]
//             //     );
//             //     distProductId = refProductResult.rows[0].id;
//             // } else {
//             //     distProductId = existingRefProduct.rows[0].id;
//             // }

//             const existingProduct = await pool.query(
//                 'SELECT * FROM product WHERE name = $1 AND price = $2 AND supp_id = $3',
//                 [name, price, supp_id]
//             );

//             if (existingProduct.rows.length > 0) {
//                 const product_id = existingProduct.rows[0].id;

//                 const newQuantity = existingProduct.rows[0].quantity + batch_quantity;
//                 await pool.query(
//                     'UPDATE product SET quantity = $1 WHERE id = $2',
//                     [newQuantity, product_id]
//                 );

//                 const manufacturedDate = manufactured || new Date();
//                 await pool.query(
//                     'INSERT INTO batch (product_id, batche_no, batch_quantity, manufactured, supp_id) VALUES ($1, $2, $3, $4, $5)',
//                     [product_id, newBatchNo, batch_quantity, manufacturedDate, supp_id]
//                 );

//                 createdProducts.push({
//                     product: existingProduct.rows[0],
//                     batch: { batche_no: newBatchNo, batch_quantity }
//                 });
//             } else {
//                 const productResult = await pool.query(
//                     'INSERT INTO product (name, description, category, price, supp_id, quantity, received_quantity,received_data,image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *',
//                     [name, description, category, price, supp_id, batch_quantity, batch_quantity, new Date(), imagePath]
//                 );
//                 const product_id = productResult.rows[0].id;
//                 const manufacturedDate = manufactured || new Date();
//                 await pool.query(
//                     'INSERT INTO batch (product_id, batche_no, batch_quantity, manufactured, supp_id,image) VALUES ($1, $2, $3, $4, $5,$6)',
//                     [product_id, newBatchNo, batch_quantity, manufacturedDate, supp_id, imagePath]
//                 );

//                 createdProducts.push({
//                     product: productResult.rows[0],
//                     batch: { batche_no: newBatchNo, batch_quantity }
//                 });
//             }
//         }

//         res.json({
//             message: "Products and batches added/updated successfully",
//             success: true,
//             data: createdProducts
//         });

//     } catch (error) {
//         console.error("Error adding products and batches:", error);
//         res.json({ message: "Failed to add/update products and batches", success: false });
//     }
// };


const createProductsWithBatch = async (req, res) => {
    const { supp_id, products } = req.body;

    try {
        const supplierCheck = await pool.query('SELECT * FROM supplier WHERE id = $1', [supp_id]);
        if (supplierCheck.rows.length === 0) {
            return res.json({ message: "Supplier not found", success: false });
        }

        const createdProducts = [];

        const batchNoResult = await pool.query('SELECT MAX(batche_no) AS max_batch_no FROM batch');
        const maxBatchNo = batchNoResult.rows[0].max_batch_no || 0;
        const newBatchNo = maxBatchNo + 1;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(product);

            const { name, description, category, price, batch_quantity, manufactured, received_data } = product;

            // Fetch the corresponding image from req.files
            const imageField = `products[${i}][image]`;
            const imagePath = req.files[imageField] ? req.files[imageField][0].path : null;

            const existingProduct = await pool.query(
                'SELECT * FROM product WHERE name = $1 AND price = $2 AND supp_id = $3',
                [name, price, supp_id]
            );

            if (existingProduct.rows.length > 0) {
                // Update existing product's quantity
                const product_id = existingProduct.rows[0].id;
                const newQuantity = existingProduct.rows[0].quantity + batch_quantity;

                await pool.query(
                    'UPDATE product SET quantity = $1 WHERE id = $2',
                    [newQuantity, product_id]
                );

                // Insert into batch table
                const manufacturedDate = manufactured || new Date();
                await pool.query(
                    'INSERT INTO batch (product_id, batche_no, batch_quantity, manufactured, supp_id, image) VALUES ($1, $2, $3, $4, $5, $6)',
                    [product_id, newBatchNo, batch_quantity, manufacturedDate, supp_id, imagePath]
                );

                createdProducts.push({
                    product: existingProduct.rows[0],
                    batch: { batche_no: newBatchNo, batch_quantity }
                });
            } else {
                // Insert new product
                const productResult = await pool.query(
                    'INSERT INTO product (name, description, category, price, supp_id, quantity, received_quantity, received_data, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                    [name, description, category, price, supp_id, batch_quantity, batch_quantity, new Date(), imagePath]
                );

                const product_id = productResult.rows[0].id;
                const manufacturedDate = manufactured || new Date();

                // Insert into batch table
                await pool.query(
                    'INSERT INTO batch (product_id, batche_no, batch_quantity, manufactured, supp_id, image) VALUES ($1, $2, $3, $4, $5, $6)',
                    [product_id, newBatchNo, batch_quantity, manufacturedDate, supp_id, imagePath]
                );

                createdProducts.push({
                    product: productResult.rows[0],
                    batch: { batche_no: newBatchNo, batch_quantity }
                });
            }
        }

        res.json({
            message: "Products and batches added/updated successfully",
            success: true,
            data: createdProducts
        });



    } catch (error) {
        console.error("Error adding products and batches:", error);
        res.json({ message: "Failed to add/update products and batches", success: false });
    }
};


// const getProdBatch = async (req, res) => {
//     const { batche_no } = req.query;  
//     try {
//         const { rows } = await pool.query(
//             'SELECT batch.batche_no, batch.batch_quantity, product.name, product.description, product.category, product.price ' +
//             'FROM batch INNER JOIN product ON batch.product_id = product.id ' +
//             'WHERE batche_no = $1', 
//             [batche_no]
//         );

//         if (rows.length === 0) {
//             return res.json({ message: "No batches found", success: false });
//         }

//         res.json({ data: rows, success: true });
//     } catch (error) {
//         res.json({ message: "Failed to fetch data", success: false });
//     }
// };


const placeOrder = async (req, res) => {
    const { customer_name, customer_contact, user_id, email, cart } = req.body;


    const result = await pool.query(
        'INSERT INTO orders (customer_name, customer_contact,email) VALUES ($1, $2,$3) RETURNING order_id',
        [customer_name, customer_contact, email]
    );
    const orderId = result.rows[0].order_id;

    for (const product of cart) {
        const { id, quantity } = product;

        const productResult = await pool.query(
            'SELECT price, quantity FROM product WHERE id = $1',
            [id]
        );

        if (productResult.rows.length < 1) {
            return res.json({ message: "Product not found", success: false });
        }

        const prod_price = productResult.rows[0].price;
        const prod_quant = productResult.rows[0].quantity;

        const batchResult = await pool.query(
            'SELECT batch_id, batch_quantity FROM batch WHERE product_id = $1 ORDER BY batch_id ASC',
            [id]
        );

        let totalAvailableQuantity = 0;
        for (const batch of batchResult.rows) {
            totalAvailableQuantity += batch.batch_quantity;
        }

        if (totalAvailableQuantity >= quantity) {
            let remainingQuantity = quantity;
            const prod_total = prod_price * quantity;

            for (const batch of batchResult.rows) {
                if (remainingQuantity <= 0) break;

                const { batch_id, batch_quantity } = batch;

                if (batch_quantity >= remainingQuantity) {
                    await pool.query(
                        'UPDATE batch SET batch_quantity = batch_quantity - $1 WHERE batch_id = $2',
                        [remainingQuantity, batch_id]
                    );
                    remainingQuantity = 0;
                } else {
                    await pool.query(
                        'UPDATE batch SET batch_quantity = 0 WHERE batch_id = $1',
                        [batch_id]
                    );
                    remainingQuantity -= batch_quantity;
                }
            }

            await pool.query(
                'UPDATE product SET quantity = quantity - $1 WHERE id = $2',
                [quantity, id]
            );

            await pool.query(
                'INSERT INTO order_items (order_id, product_id,user_id, quantity, price_at_purchase, total_price,order_time) VALUES ($1, $2,$3, $4, $5,$6,$7)',
                [orderId, id, user_id, quantity, prod_price, prod_total, new Date()]
            );

        } else {
            return res.json({ message: "Not enough stock available", success: false });
        }
    }

    res.json({ message: "Order placed successfully", orderId: orderId, success: true });
};

const orderHistory = async (req, res) => {
    const { user_id, isAdmin } = req.body;
    try {
        let query = `
            SELECT 
                oi.quantity, 
                oi.price_at_purchase, 
                oi.total_price, 
                o.customer_name, 
                o.customer_contact, 
                o.email, 
                oi.order_id,
                p.name AS product_name, 
                p.category 
            FROM order_items oi 
            JOIN orders o ON oi.order_id = o.order_id 
            JOIN product p ON oi.product_id = p.id`;

        let params = [];

        if (!isAdmin) {
            query += " WHERE user_id = $1";
            params.push(user_id);
        }

        const result = await pool.query(query, params);

        const rows = result.rows;

        if (rows.length > 0) {
            res.json({ data: rows, success: true });
        } else {
            res.json({ data: [], success: true });
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.json({ message: "Failed to fetch orders history", success: false });
    }
};

const getReceiptRecord = async (req, res) => {
    const { order_id } = req.body;
    try {
        const { rows } = await pool.query(`
        SELECT  oi.quantity, oi.price_at_purchase, oi.total_price, o.customer_name, o.customer_contact, o.email, p.name AS product_name, p.category 
        FROM order_items oi JOIN orders o ON oi.order_id = o.order_id 
        JOIN product p ON oi.product_id = p.id where oi.order_id=$1`, [order_id]);

        res.json({ data: rows, success: true })
    } catch (error) {
        res.json({ message: "failed to fetch receipt", success: false })
    }
}




module.exports = { multipleUpload, upload, createProductsWithBatch, getAdmin, signupadmin, adminLogin, getReceiptRecord, getSingleAdmin, updateAdmin, deleteAdmin, createProduct, getProducts, createBatch, getProdBatch, getIndProd, addIndProduct, getSupplier, addSupplier, prodBySupplier, placeOrder, orderHistory };