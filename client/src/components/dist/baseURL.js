"use strict";
exports.__esModule = true;
exports.baseURL = void 0;
exports.baseURL = 'http://localhost:5000/api';
if (process.env.NODE_ENV === 'development') {
    exports.baseURL = "http://localhost:5000";
}
else {
    exports.baseURL = "https://mern-blog-chappo050.herokuapp.com";
}
