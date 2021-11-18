const {
    Schema,
    model
} = require('mongoose')

const workSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    categoryId: {
        ref: 'categorys',
        type: Schema.Types.ObjectId,
        required: true
    }
})

module.exports = model('work', workSchema)