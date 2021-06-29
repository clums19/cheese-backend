// Dependencies

require('dotenv').config();
const {PORT = 5000, MONGODB_URL} = process.env;
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');
const morgan = require('morgan');

// Database Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// conection events
mongoose.connection
    .on("open", () => console.log("You are connected to mongoose"))
    .on("close", () => console.log("You are disconnected from mongoose"))
    .on("error", (error) => console.log(error));

// Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});
const Cheese = mongoose.model('Cheese', CheeseSchema)
//Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
// test
app.get('/', (req, res) => {
    res.send('Hello Chelsea')
});
// index
app.get('/cheese', async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// delete
app.delete('/cheese/:id', async(req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id));
    } catch(error) {
        res.status(400).json(error);
    }
});
// update
app.put('/cheese/:id', async(req, res) => {
    try {
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, {new:true}));
    } catch(error) {
        res.status(400).json(error);
    }
});
// create
app.post('/cheese', async (req, res) => {
    try {
        // send all people
        res.json(await Cheese.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});



// Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));