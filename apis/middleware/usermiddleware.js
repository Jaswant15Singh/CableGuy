
// const { user } = require("pg/lib/defaults");

const usermiddleware = (req, res, next) => {
    const role = req.userRole;


    console.log(role)
    // if (role === "admin" || role === "user") {
    //     next();
    // } else {
    //     res.status(403).json({ message: "Access denied1" });
    // }
}

module.exports = usermiddleware;
