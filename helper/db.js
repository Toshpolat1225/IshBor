const mongoose = require('mongoose');
const URI = 'mongodb+srv://texnar1225:texnar1225@cluster0.ov7ap.mongodb.net/work'

module.exports = async () => {
    try {
        await mongoose.connect(URI);

        const db = mongoose.connection

        db.on('error', console.error.bind(console, 'Console error'))
        db.once('open', function () {
            console.log('MongoDB success connected');
        })

    } catch (error) {
        console.log(error);
    }
}
