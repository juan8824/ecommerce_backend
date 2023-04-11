const { getAll, create, getOne, remove } = require('../controllers/category.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const categoryRouter = express.Router();

categoryRouter.route('/')
    .get(getAll)
    .post(verifyJWT, create);

categoryRouter.route('/:id')
    .get(getOne)
    .delete(verifyJWT, remove)

module.exports = categoryRouter;