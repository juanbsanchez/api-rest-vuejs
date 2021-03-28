const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config();

const app = express();

//body capture
app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

//BBDD
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.yizyf.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const options = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(uri, options)
    .then(()=> console.log('database is conected'))
    .catch(e => console.log('database error:', e));

//import routes
const authRouter = require('./routes/auth');

//route middlewares
app.use('/api/user', authRouter);
app.get('/', (req, res)=>{
    res.json({
        state: true,
        message: 'it works'
    })
});

//start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`server run on ${PORT}`);
})