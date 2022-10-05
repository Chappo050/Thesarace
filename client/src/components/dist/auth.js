"use strict";
exports.__esModule = true;
//IMPROTS//
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var axios_1 = require("axios");
//API setup
var api = axios_1["default"].create({
    baseURL: "http://localhost:5000/user/auth"
});
function Auth() {
    var _a = react_1.useState(false), logged = _a[0], setLogged = _a[1];
    react_1.useEffect(function () {
        api.get("/").then(function (res) {
            if (res.status === 200) {
                setLogged(true);
            }
        });
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_router_dom_1.Outlet, null)));
}
exports["default"] = Auth;
