const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const path = require('path');

const database = require('./config/db');

require('./utils/passport-config');

const teacherRoutes = require('./routes/Teacter');

dotenv.config();
const app = express();


app.use(passport.initialize());
app.use(express.json());

app.use('/user', teacherRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});