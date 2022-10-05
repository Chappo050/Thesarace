"use strict";
exports.__esModule = true;
//IMPROTS//
var react_1 = require("react");
var axios_1 = require("axios");
var react_router_dom_1 = require("react-router-dom");
//API setup
var api = axios_1["default"].create({
    baseURL: "/api/user/logout",
    withCredentials: true
});
function UserLogin() {
    var navigate = react_router_dom_1.useNavigate();
    react_1.useEffect(function () {
        api.get('');
        setTimeout(function () {
            navigate('/');
        }, 2000);
    }, []);
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { className: "text-whitefont-bold text-center m-10 text-2xl" }, "Logout Successful. Redirecting.")));
}
exports["default"] = UserLogin;
