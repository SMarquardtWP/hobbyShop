'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/hobbyShop';
exports.JWT_SECRET = "secret";

exports.PORT = process.env.PORT || 8080;