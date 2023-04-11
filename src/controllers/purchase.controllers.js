const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getAll = catchError(async(req, res) => {
    const id = req.user.id;
    const purchases = await Purchase.findAll({where: {userId: id}, include: [Product]})
    return res.json(purchases)
});

const purchaseCart = catchError(async(req, res) => {
    const cart = await Cart.findAll({where: {userId: req.user.id}, attributes: ['quantity', 'productId', 'userId'], raw: true});
    Purchase.bulkCreate(cart);
    await Cart.destroy({where: {userId: req.user.id}});
    return res.json(cart);
})

module.exports = {
    getAll,
    purchaseCart
}