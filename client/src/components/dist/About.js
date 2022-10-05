"use strict";
exports.__esModule = true;
var Nav_1 = require("./Nav");
function Blog() {
    return (React.createElement("div", null,
        React.createElement(Nav_1["default"], null),
        React.createElement("div", { className: "text-center text-2xl p-10" },
            "This blog was my first full stack project. ",
            React.createElement("p", null),
            "The code can be found on my ",
            React.createElement("a", { className: "p-0 underline hover:text-custom-green-blue", href: "https://github.com/Chappo050" }, "GitHub"),
            " along with the rest of my projects.")));
}
exports["default"] = Blog;
