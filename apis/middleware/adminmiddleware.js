
const adminmiddleware = (req, res, next) => {
    const role = req.userRole;


    // console.log(role);
    if(role === "admin"){
        next();
    }

    else{
        res.json({message:"access denied"})
    }
    // if (role === "admin" || role === "user") {
    //     next();
    // } else {
    //     res.status(403).json({ message: "Access denied1" });
    // }
}

module.exports = adminmiddleware;
