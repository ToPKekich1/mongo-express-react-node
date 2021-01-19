const express = require('express');

const app = express();
const config = require('config');
const mongoose = require('mongoose');

app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));

const PORT = config.get('port') || 5000;

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(PORT, () => {
            console.log('Server in running on port ' + PORT);
        });
    } catch (error) {
        console.log('Server Error', error.message);
        process.exit(1);
    }
};

start();
