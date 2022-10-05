"use strict";
exports.__esModule = true;
//IMPROTS//
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var axios_1 = require("axios");
//Components//
var Nav_1 = require("../Nav");
//API setup
var api = axios_1["default"].create({
    baseURL: "http://localhost:5000/user"
});
function User() {
    react_1.useEffect(function () {
        api.get("/").then(function (res) {
            (res.data);
        });
    }, []);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(Nav_1["default"], null),
        react_1["default"].createElement(react_router_dom_1.Outlet, null)));
}
exports["default"] = User;
