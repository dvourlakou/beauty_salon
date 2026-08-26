const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

//import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

//use routes
app.use('/api/auth', authRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api-docs', swaggerUi.serve);

app.get('/api-docs', swaggerUi.setup(swaggerSpecs));

//test route
app.get('/', (req,res) => {
    res.send('Beauty Salon API is running');
});

//διακοπή σύνδεσης με τη MySQL
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

sequelize.sync({ alter: true})
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch((err) => {
        console.error('Error syncing Database:', err);
    });


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
