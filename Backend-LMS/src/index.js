const express = require('express');
const cors = require('cors');

const {ServerConfig} = require('./config');
const apiRoutes = require('./routes')

const app = express();

// Move CORS configuration BEFORE other middleware and routes
app.use(cors({
  origin: "http://localhost:1234", // frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully server started on port : ${ServerConfig.PORT}`);
});