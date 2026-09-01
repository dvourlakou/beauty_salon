const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');

//Register (εγγραφή νέου χρήστη)
const register = async (req,res) => {
    try {
        const {email, name, password} = req.body;

        //έλεγχος για το αν υπάρχει ο χρήστης
        const existingUser = await User.findOne({ where: {email} });
        if (existingUser) {
            return res.status(400).json({message: 'Το email χρησιμοποιείται ήδη'} );
        }

        //κρυπτογράφηση του κωδικού
        const hashedPassword = await bcrypt.hash(password,10);

        //δημιουργία χρήστη
        const user = await User.create({
            email,
            name,
            password: hashedPassword,
        });

        //απάντηση χωρίς τον κωδικό
        res.status(201).json({
            message: 'Η εγγραφή ήταν επιτυχής',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Παρουσιάστηκε σφάλμα στο διακομιστή'});
    }
};

//Login (σύνδεση χρήστη)
const login = async(req,res) => {
    try {
        const {email,password} = req.body;

        //βρίσκουμε το χρήστη
        const user = await User.findOne({ where: {email}});
        if (!user) {
            return res.status(401).json({message:'Λάθος email ή password'});
        }

        //επαλήθευση κωδικού
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Λάθος email ή password'});
        }

        //δημιουργία JWT token
        const token = jwt.sign ({
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles},
        process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        //απάντηση
        res.status(200).json({
            message: 'Η σύνδεση σας ήταν επιτυχής',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: user.roles,
            },
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα στο διακομιστή'});
    }
};

const getMe = async (req,res) => {
    try {
        res.status(200).json({
            id: 1,
            email: 'dvou@hotmail.gr',
            role: "ADMIN",
            name: "admin user"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Παρουσιάστηκε σφάλμα κατά τη λήψη του χρήστη'});
    }
};

module.exports = {register,login, getMe};
