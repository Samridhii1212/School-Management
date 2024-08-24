const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/api/schools', schoolRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
