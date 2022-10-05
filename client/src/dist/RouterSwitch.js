"use strict";
exports.__esModule = true;
var react_router_dom_1 = require("react-router-dom");
var App_1 = require("./App");
var User_1 = require("./components/User/User");
var Blog_1 = require("./components/Blog/Blog");
var BlogOverview_1 = require("./components/Blog/BlogOverview");
var About_1 = require("./components/About");
var UserLogin_1 = require("./components/User/UserLogin");
var UserLogout_1 = require("./components/User/UserLogout");
var UserRegister_1 = require("./components/User/UserRegister");
var UserAuth_1 = require("./components/User/UserAuth");
var BlogPost_1 = require("./components/Blog/BlogPost");
var BlogEdit_1 = require("./components/Blog/BlogEdit");
var BlogUser_1 = require("./components/Blog/BlogUser");
var RouteSwitch = function () {
    return (React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement(react_router_dom_1.Routes, null,
            React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(App_1["default"], null) }),
            React.createElement(react_router_dom_1.Route, { path: "user", element: React.createElement(User_1["default"], null) },
                React.createElement(react_router_dom_1.Route, { path: "register", element: React.createElement(UserRegister_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "login", element: React.createElement(UserLogin_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "logout", element: React.createElement(UserLogout_1["default"], null) })),
            React.createElement(react_router_dom_1.Route, { path: "blog", element: React.createElement(Blog_1["default"], null) },
                React.createElement(react_router_dom_1.Route, { path: "overview", element: React.createElement(BlogOverview_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: ":userId", element: React.createElement(BlogUser_1["default"], null) }),
                React.createElement(react_router_dom_1.Route, { path: "post", element: React.createElement(UserAuth_1["default"], null,
                        React.createElement(BlogPost_1["default"], null)) }),
                React.createElement(react_router_dom_1.Route, { path: "post/:postId", element: React.createElement(UserAuth_1["default"], null,
                        React.createElement(BlogEdit_1["default"], null)) })),
            React.createElement(react_router_dom_1.Route, { path: "about", element: React.createElement(About_1["default"], null) }))));
};
exports["default"] = RouteSwitch;
