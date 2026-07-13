require("dotenv").config();

const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const teamRoutes = require('./routes/teams');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded( { extended: true }));

app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ status: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});