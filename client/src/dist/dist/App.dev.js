"use strict";

exports.__esModule = true;

var react_1 = require("react");

var axios_1 = require("axios");

var Nav_1 = require("./components/Nav");

var api = axios_1["default"].create({
  baseURL: 'http://localhost:5000'
});

function App() {
  react_1.useEffect(function () {
    api.get('/').then(function (res) {
      res.data;
    });
  }, []);
  return react_1["default"].createElement("div", null, react_1["default"].createElement(Nav_1["default"], null), react_1["default"].createElement("div", {
    className: "text-whitefont-bold text-center m-10 text-2xl"
  }, react_1["default"].createElement("div", null, "WELCOME TO MY BLOG"), react_1["default"].createElement("br", null), react_1["default"].createElement("br", null), react_1["default"].createElement("div", null, "Please take a look at what I have been up too or post something yourself."), react_1["default"].createElement("br", null), react_1["default"].createElement("br", null), "To learn more this project check out the about tab."));
}

exports["default"] = App;