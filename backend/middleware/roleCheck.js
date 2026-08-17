const isAdmin = (req,res,next) => {
    if (!req.user) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({message: 'Forbidden: Admin access required'});
    }
    next();
};

const isEmployee = (req,res,next) => {
    if (!req.user) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    if (req.user.role !== 'ADMIN' && req.user.role !== 'EMPLOYEE') {
        return res.status(403).json({message: 'Forbidden: Employee access required'});
    }
    next();
};

module.exports = {isAdmin,isEmployee};
