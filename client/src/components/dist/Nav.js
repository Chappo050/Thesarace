"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("@headlessui/react");
var solid_1 = require("@heroicons/react/20/solid");
var Nav = function () {
    return (react_1["default"].createElement("nav", { className: "sticky top-0 w-screen bg-custom-black text-custom-green-blue pl-28 border-b-2 border-custom-silver" },
        react_1["default"].createElement("div", { className: " grid grid-flow-col-dense space-x-32 text-xl text-custom-blue  font-semibold" },
            react_1["default"].createElement("i", { className: "logoplaceholder" }),
            react_1["default"].createElement(DropdownMenu, { title: 'User', options: ["Login", "Register", "Sign Out"], links: ["/user/login", "/user/register", "/user/logout"] }),
            react_1["default"].createElement(DropdownMenu, { title: 'Blog', options: ["Overview", "Post"], links: ["/blog/overview", "/blog/post"] }),
            react_1["default"].createElement(DropdownMenu, { title: 'About', options: ["About"], links: ["/about"] }),
            react_1["default"].createElement("i", null))));
};
var classNames = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return classes.filter(Boolean).join(" ");
};
var DropdownMenu = function (_a) {
    var options = _a.options, links = _a.links, title = _a.title;
    return (react_1["default"].createElement(react_2.Menu, { as: "div", className: "relative inline-block text-left py-4 text-custom-green-blue" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement(react_2.Menu.Button, { className: "inline-flex w-2/3 justify-center rounded-md  bg-custom-black px-4 py-2  hover:bg-custom-dark-blue focus:outline-none focus:ring-1 focus:ring-custom-silver" },
                title,
                react_1["default"].createElement(solid_1.ChevronDownIcon, { className: "-mr-1 ml-2 h-8 w-5", "aria-hidden": "true" }))),
        react_1["default"].createElement(react_2.Transition, { as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95" },
            react_1["default"].createElement(react_2.Menu.Items, { className: "absolute z-10 mt-2 w-56 right-20 origin-top-right rounded-md bg-custom-dark-blue shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" },
                react_1["default"].createElement("div", { className: "py-1 " },
                    react_1["default"].createElement(react_1["default"].Fragment, null, options.map(function (option, i) { return DropdownMenuItem(option, links[i]); })))))));
};
//Iterates over each item for the menu and adds links as href
var DropdownMenuItem = function (option, itemLink) {
    return (react_1["default"].createElement(react_2.Menu.Item, null, function (_a) {
        var active = _a.active;
        return (react_1["default"].createElement("a", { href: itemLink, className: classNames(active ? "bg-gray-900 text-white" : "text-custom-green-blue", "block px-4 py-2 text-sm") }, option));
    }));
};
exports["default"] = Nav;
