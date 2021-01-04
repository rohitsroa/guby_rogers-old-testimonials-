var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
// Get Page model
var Price = require('../models/price');
var Testimonial = require('../models/testimonial');

/* * GET products index
 */
router.get('/',function (req, res) {
    Price.find(function (err, prices) {
        Testimonial.find(function (err, testimonials) {
                res.render('index', {
                    prices:prices,
                    testimonials:testimonials
                 })});
});
});
router.get('/',function (req, res) {
    Testimonial.find(function (err, testimonials) {
        res.render('index', {
            testimonials:testimonials,
    });
});
});
router.get('/admin', function (req, res) {
    res.render('_layouts/adminheader');
});

router.get('/admin/prices',function (req, res) {
    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
        res.render('admin/prices', {
            prices: prices
        });
    });
});
/*
 * GET products index
 */
router.get('/admin/testimonials',function (req, res) {
    var count;

    Testimonial.count(function (err, c) {
        count = c;
    });

    Testimonial.find(function (err, testimonials) {
        res.render('admin/testimonials', {
            testimonials: testimonials,
            count: count
        });
    });
});
/*
 * GET add product
 */
router.get('/admin/testimonial/add-testimonial',function (req, res) {

    var name = "";
    var content = "";

    Testimonial.find(function (err, testimonials) {
        res.render('admin/add_testimonial', {
            name: name,
            content: content,
        });
    });

});

/*
 * POST add product
 */
router.post('/admin/testimonial/add-testimonial', function (req, res) {

    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    // req.checkBody('name', 'Name must have a value.').notEmpty();
    // req.checkBody('content', 'Content must have a value.').notEmpty();
    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    // var errors = req.validationErrors();

    // if (errors) {
    //     Testimonial.find(function (err, testimonials) {
    //         res.render('admin/add_testimonial', {
    //             errors: errors,
    //             name: name,
    //             content: content,
    //         });
    //     });
    // } else {
                var testimonial = new Testimonial({
                    name: name,
                    slug: slug,
                    content: content,
                    image: imageFile
                });

                testimonial.save(function (err) {
                    if (err)
                        return console.log(err);

                    mkdirp('public/testimonial_images/' + testimonial._id, function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/testimonial_images/' + testimonial._id + '/gallery', function (err) {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        var testimonialImage = req.files.image;
                        var path = 'public/testimonial_images/' + testimonial._id + '/' + imageFile;

                        testimonialImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Testimonial added!');
                    res.redirect('/admin/testimonials');
                });
            }
    );

/*
 * GET edit product
 */
router.get('/admin/testimonial/edit-testimonial/:id', function (req, res) {

    var errors;

    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;
    Testimonial.findById(req.params.id, function (err, p) {
            if (err) {
                console.log(err);
                res.redirect('/admin/testimonials');
            } else {
                var galleryDir = 'public/testimonial_images/' + p._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_testimonial', {
                            name: p.name,
                            errors: errors,
                            content: p.content,
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id
                        });
                    }
                });
            }
        });

    });

/*
 * POST edit product
 */
router.post('/admin/testimonial/edit-testimonial/:id', function (req, res) {

    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    // req.checkBody('name', 'Name must have a value.').notEmpty();
    // req.checkBody('content', 'Content must have a value.').notEmpty();
    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var pimage = req.body.pimage;
    var id = req.params.id;

    // var errors = req.validationErrors();

    // if (errors) {
    //     req.session.errors = errors;
    //     res.redirect('/admin/testimonial/edit-tesimonial/' + id);
    // } else {
        Testimonial.findOne({slug: slug, _id: {'$ne': id}}, function (err, p) {
            if (err)
                console.log(err);
            else {
                Testimonial.findById(id, function (err, p) {
                    if (err)
                        console.log(err);

                    p.name = name;
                    p.slug = slug;
                    p.content = content;
                    if (imageFile != "") {
                        p.image = imageFile;
                    }

                    p.save(function (err) {
                        if (err)
                            console.log(err);

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/testimonial_images/' + id + '/' + pimage, function (err) {
                                    if (err)
                                        console.log(err);
                                });
                            }

                            var testimonialImage = req.files.image;
                            var path = 'public/testimonial_images/' + id + '/' + imageFile;

                            testimonialImage.mv(path, function (err) {
                                return console.log(err);
                            });
                            Testimonial.find({}).sort({sorting: 1}).exec(function (err, testimonials) {
                                if (err) {
                                        console.log(err);
                                } else {
                                        req.app.locals.testimonials = testimonials;
                                }
                                });
                        

                        }

                        req.flash('success', 'Testimonial edited!');
                        res.redirect('/admin/testimonial/edit-testimonial/' + id);
                    });

                });
            }
        });
    }

);

/*
 * POST product gallery
 */
router.post('/admin/testimonial/testimonial-gallery/:id', function (req, res) {

    var testimonialImage = req.files.file;
    var id = req.params.id;
    var path = 'public/testimonial_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/testimonial_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    testimonialImage.mv(path, function (err) {
        if (err)
            console.log(err);

        resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);

});

/*
 * GET delete image
 */
router.get('/admin/testimonial/delete-image/:image', function (req, res) {

    var originalImage = 'public/testimonial_images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/testimonial_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/testimonial/edit-testimonial/' + req.query.id);
                }
            });
        }
    });
});

/*
 * GET delete product
 */
router.get('/admin/testimonial/delete-testimonial/:id',function (req, res) {

    var id = req.params.id;
    var path = 'public/testimonial_images/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Testimonial.findByIdAndRemove(id, function (err) {
                console.log(err);
            });
            
            req.flash('success', 'Testimonial deleted!');
            res.redirect('/admin/testimonials');
        }
    });

});

/*
 * GET edit price
 */
router.get('/admin/prices/edit-price/:id',function (req, res) {

    Price.findById(req.params.id, function (err, prices) {
        if (err)
            return console.log(err);

        res.render('admin/edit_price', {
            title: prices.title,
            amount: prices.amount,
            id: prices._id
        });
    });

});
// Sort pages function
function sortPages(ids, callback) {
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Price.findById(id, function (err, prices) {
                prices.sorting = count;
                price.save(function (err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}
/*
 * POST reorder pages
 */
router.post('/admin/prices/reorder-pages', function (req, res) {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.prices = prices;
            }
        });
    });

});

/*
 * POST edit price
 */
router.post('/admin/prices/edit-price/:id', function (req, res) {
    var title = req.body.title;
    var amount = req.body.amount;
    var id = req.params.id;

        Price.findById(id, function (err, prices) {
            if (err)
                return console.log(err);

                prices.title = title;
                prices.amount = amount;

                prices.save(function (err) {
                    if (err)
                        return console.log(err);
                    Price.find({}).sort({sorting: 1}).exec(function (err, prices) {
                        if (err) {
                                console.log(err);
                        } else {
                                req.app.locals.prices = prices;
                        }
                        });
                req.flash('success', 'Price edited!');
                res.redirect('/admin/prices/');
                    });

                });
            });

// Exports
module.exports = router;
