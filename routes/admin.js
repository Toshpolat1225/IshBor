const { Router } = require('express')
const router = Router()
const mongoose = require('mongoose')
const fileMiddleware = require("../middleware/fileUpload")
const Category = require('../models/Category')
const Work = require('../models/Work')
const toDelete = require('../middleware/toDelete')
const moment = require('moment');
/* GET users listing. */


router.get('/', (req, res, next) => {
    res.render('admin/index', {
        layout: 'main',
    })
});
/* +++++++++++++++++++++++++++++++++++++++ Categorys ++++++++++++++++++++++++++++++++++++++++++++++ */
router.get('/categorys', async (req, res, next) => {
    const categorys = await Category.find()
    res.render('admin/categorys', {
        layout: 'main',
        title: "Create category",
        categorys,
    })
});

router.get('/categorys/add', async (req, res, next) => {
    res.render('admin/addCategory', {
        layout: "main",
        title: 'Create category',
    })
});

router.get('/categorys/:id', async (req, res, next) => {
    const { title } = await Category.findById(req.params.id)
    let works = await Category.aggregate([{
        $lookup: {
            from: "works",
            localField: "_id",
            foreignField: "categoryId",
            as: "works"
        }
    },
    {
        $match: {
            _id: mongoose.Types.ObjectId(req.params.id)
        }
    },
    {
        $group: {
            _id: {
                _id: "$_id"
            },
            works: {
                $push: "$works"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            name: "$_id.name",
            price: "$_id.price",
            comment: "$_id.comment",
            adress: "$_id.adress",
            img: "$_id.img",
            works: "$works"
        }
    },
    {
        $unwind: {
            path: "$works"
        }
    },

    ])
    console.log(works);
    if (works.length) {
        works = works[0].works
    } else {
        works = ""
    }
    res.render('admin/category', {
        title: title,
        layout: "main",
        works,
    })
});

router.get('/categorys/edit/:id', async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    res.render('admin/editCategory', {
        layout: "main",
        title: 'Edit category',
        category,
    })
});

router.post('/categorys/add', fileMiddleware.single("img"), async (req, res) => {
    const { name } = req.body

    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }

    const category = new Category({
        name,
        img,
    })
    await category.save()
    res.redirect('/admin/categorys')
});

router.post("/categorys/edit/:id", fileMiddleware.single("img"), async (req, res, next) => {
    const { img } = await Category.findById(req.params.id)
    toDelete(img)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    admin.img = req.file.filename
    await Category.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/admin/categorys")
        }
    })
});

router.get("/categorys/delete/:id", async (req, res, next) => {
    const { img } = await Category.findById(req.params.id)
    toDelete(img)
    await Category.findByIdAndDelete(req.params.id)
    res.redirect("/admin/categorys")
});



/* +++++++++++++++++++++++++++++++++++++++ Works ++++++++++++++++++++++++++++++++++++++++++++++ */


router.get("/works", async (req, res, next) => {
    const works = await Work.find()
    res.render("admin/works", {
        layout: "main",
        title: "Works",
        works,
    })
});

router.get('/works/add', async (req, res, next) => {
    const categorys = await Category.find()
    res.render('admin/addWork', {
        layout: "main",
        title: 'Create Work',
        categorys,
    })
});

router.get("/works/:id", async (req, res, next) => {
    const {
        title
    } = await Work.findById(req.params.id)
    const work = await Work.findById(req.params.id)
    console.log(work);
    res.render('admin/work', {
        title: title,
        layout: "main",
        work,
    })
});

router.get("/works/edit/:id", async (req, res, next) => {
    const work = await Work.findById(req.params.id)
    const categorys = await Category.find()
    res.render('admin/editWork', {
        layout: "main",
        title: 'Edit Work',
        work,
        categorys,
    })
});

router.post('/works/add', fileMiddleware.single("img"), async (req, res, next) => {
    const {
        name,
        price,
        comment,
        adress,
        categoryId
    } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const work = new Work({
        name,
        price,
        comment,
        adress,
        img,
        categoryId
    })
    await work.save()
    res.redirect('/admin/works')
});

router.post("/works/edit/:id", fileMiddleware.single("img"), async (req, res, next) => {
    const {
        img
    } = await Work.findById(req.params.id)
    toDelete(img)
    const admin = req.body
    if (req.file) {
        admin.img = req.file.filename
        toDelete(img)
    } else {
        admin.img = img
    }
    admin.img = req.file.filename

    await Work.findByIdAndUpdate(req.params.id, admin, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/admin/works")
        }
    })
});

router.get("/works/delete/:id", async (req, res, next) => {
    const {
        img
    } = await Work.findById(req.params.id)
    toDelete(img)
    await Work.findByIdAndDelete(req.params.id)
    res.redirect("/admin/works")
});

module.exports = router;