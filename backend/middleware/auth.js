const jwt = require('jsonwebtoken');

const authMiddleware = ( req, res, next) => {
    try {
        // Παίρνω το token από το header Authorization
        const authHeader  = req.header('Authorization') || req.header('authorization');
        const token = authHeader?.split(' ')[1];

        // Αν δεν υπάρχει token στέλνω error
        if (!token) {
            return res.status(401).json({message: 'Authentication required'});
        }


        // Βάζω τα δεδομένα του χρήστη στο req.user
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        // Συνεχίζω στο επόμενο middleware route
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

module.exports = authMiddleware;
