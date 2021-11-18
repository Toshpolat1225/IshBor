const Category = require('../models/Category')
const Work = require('../models/Work')
const toDelete = require('../middleware/toDelete')
const mongoose = require('mongoose')
const moment = require('moment');
//------------------------------ Categorys ----------------------------
//--------------------------- All Categorys GET -----------------------
module.exports.CategorysGet = async(req, res) => {
    const categorys = await Category.find()
    res.render('admin/categorys', {
        layout: 'admin',
        title: "Create category",
        categorys,
    })
}

//--------------------------- Add Categorys GET -----------------------
module.exports.createCategorysGet = async(req, res) => {
    res.render('admin/addCategory', {
        layout: 'admin',
        title: 'Create category',
    })
}

//---------------------------- ID Categorys GET -----------------------
module.exports.idCategorysGet = async(req, res) => {
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
        layout: 'admin',
        works,
    })
}

//-------------------------- Edit Categorys GET -----------------------
module.exports.editCategorysGet = async(req, res) => {
    const category = await Category.findById(req.params.id)
    res.render('admin/editCategory', {
        layout: 'admin',
        title: 'Edit category',
        category,
    })
}

//--------------------------- Add Categorys POST -----------------------
module.exports.createCategorysPost = async(req, res) => {
    const {
        name,
    } = req.body
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
}

//--------------------------- Edit Categorys POST -----------------------
module.exports.editCategorysPost = async(req, res) => {
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
}

//--------------------------- Delete Categorys GET -----------------------
module.exports.deleteCategorysGet = async(req, res) => {
    const { img } = await Category.findById(req.params.id)
    toDelete(img)
    await Category.findByIdAndDelete(req.params.id)
    res.redirect("/admin/categorys")
}

//------------------------------ Works --------------------------------
//--------------------------- All Works GET ---------------------------
module.exports.WorksGet = async(req, res) => {
    const works = await Work.find()
    res.render("admin/works", {
        layout: "admin",
        title: "Works",
        works,
    })
}

//--------------------------- ID Work GET ---------------------------
module.exports.idWorkGet = async(req, res) => {
    const {
        title
    } = await Work.findById(req.params.id)
    const work = await Work.findById(req.params.id)
    console.log(work);
    res.render('admin/work', {
        title: title,
        layout: 'admin',
        work,
    })
}

//---------------------------- Add Works GET ---------------------------
module.exports.createWorksGet = async(req, res) => {
    const categorys = await Category.find()
    res.render('admin/addWork', {
        layout: 'admin',
        title: 'Create Work',
        categorys,
    })
}

//---------------------------- Edit Works GET --------------------------
module.exports.editWorksGet = async(req, res) => {
    const work = await Work.findById(req.params.id)
    const categorys = await Category.find()
    res.render('admin/editWork', {
        layout: 'admin',
        title: 'Edit Work',
        work,
        categorys,
    })
}

//---------------------------- Add Works POST --------------------------
module.exports.createWorksPost = async(req, res) => {
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
}

//---------------------------- Edit Works POST -------------------------
module.exports.editWorksPost = async(req, res) => {
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
}

//---------------------------- Delete Works GET ------------------------
module.exports.deleteWorksGet = async(req, res) => {
    const {
        img
    } = await Work.findById(req.params.id)
    toDelete(img)
    await Work.findByIdAndDelete(req.params.id)
    res.redirect("/admin/works")
}