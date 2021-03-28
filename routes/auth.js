import {Router} from 'express';
const router = Router();

const User = require('../models/User');

const Joi = require('@hapi/joi');

const schemaRegister = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

//import bcrypt
const bcrypt =  require('bcrypt');

router.post('/register', async(req, res)=>{

    //user validation
    const {error} = schemaRegister.validate(req.body);

    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    //Check if email exists
    const emailExists = await User.findOne({email: req.body.email});

    if(emailExists) return res.status(400).json({error: true, message: 'email is already registered'});

    //password hash
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try{
        const userDB = await user.save();

        res.json({
            error: null,
            data: userDB
        });

    }catch (err){
        res.status(400).json(err);
    }


});

module.exports = router;