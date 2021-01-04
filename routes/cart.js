var express = require('express');
var router = express.Router();

// Get Product model
var Price = require('../models/price');
/*
 * GET checkout page
 */
router.get('/add/:slug/:amount/', function (req, res) {

    var slug = req.params.slug;
    var amount = req.params.amount;
    var total= req.body.total;

    Price.findOne({slug: slug}, function (err, p) {
        if (err)
            console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                amount: p.amount,
                total:total,
                
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    amount:p.amount,
                    total:total,
                });
            }
        }

    console.log(req.session.cart);
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            cart: req.session.cart
        });
    }
});



});
router.get('/checkout', function (req, res) {
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            cart: req.session.cart
        });
    }
});

/*
 * GET update product
 */
router.get('/update/:price', function (req, res) {

    var title = req.params.price;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == title) {
            switch (action) {
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});


// Exports
module.exports = router;
