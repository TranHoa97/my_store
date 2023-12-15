const multer = require('multer')

const storage = multer.diskStorage({})
let upload = multer({
    storage: storage
})

module.exports = upload