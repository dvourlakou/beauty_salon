const jwt = require('jsonwebtoken');

const authMiddleware = ( req, res, next) => {
    try {
        // 1) Παίρνουμε το token από το header Authorization
        const token = req.header.authorization?.split(' ')[1];

        // 2) Αν δεν υπάρχει token στέλνουμε error
        if (!token) {
            return res.status(401).json({message: 'Authentication required'});
        }


        // 3) Βάζουμε τα δεδομένα του χρήστη στο req.user
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        // 4) Συνεχίζουμε στο επόμενο middleware route
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json( {message: 'Invalid token'});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json( { message: 'Token expired'});
        }
        return res.status(500).json( {message: 'Internal server error'});

    }
};

module.exports = authMiddleware();
