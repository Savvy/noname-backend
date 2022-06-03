const config = require('../data/config.json');
const multer = require('multer');

const storage = require(`../storage/${config.storage}`);

module.exports = multer({storage: storage});
