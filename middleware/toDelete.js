const fs = require('fs')
const path = require('path')

const filePath = path.join(require.main.filename)
// console.log(filePath);

module.exports = async (fileName) => {
    if (fileName) {
        console.log(fileName);
        await fs.unlink(filePath + '../../../public/dist/img/' + fileName, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }
}