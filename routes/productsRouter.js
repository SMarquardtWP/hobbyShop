'use strict';

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');

const jwtauth = passport.authenticate('jwt', { session: false });
const { Product } = require("../models");

router.use("/", bodyParser.urlencoded({
    extended: true
}));

router.get('/', (req, res) => {
    console.log(req.query);
    let search = {};

    if (req.query.name)
        search.name = {$regex: req.query.name, $options:"i" };
    if (req.query.tags)
        search.tags = { $regex: req.query.tags, $options:"i" };

    console.log(search);

    Product
        .find(search)
        .limit(10)
        .sort('name')
        .then(products => {
            console.log(products);
            res.json(products);
        })
        .catch(err => {
            res.status(500).json({message:"Error, something went wrong"});
        })
    //implement error catching
});

router.post('/', jwtauth, (req, res) => {
    // make sure to insert code forcing required fields to be entered
    Product
        .create({
            name: req.body.name,
            tags: req.body.tags,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        })
        .then(product => res.json(product));
});

router.put('/:id', jwtauth, (req, res) => {
    const updates = {};
    const updateableFields = ['name', 'tags', 'price', 'thumbnail'];

    console.log(req.params);
    console.log(req.body);

    updateableFields.forEach(field => {
        if (field in req.body) {
            updates[field] = req.body[field];
        }
    });

    Product
        .findByIdAndUpdate(req.params.id, { $set: updates }, {new:true})
        .then(product => res.status(201).json(product))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', jwtauth, (req, res) => {

    Product
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(201).json({"id":req.params.id, "status":"DELETE"}))
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = router;