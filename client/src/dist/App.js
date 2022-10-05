"use strict";
exports.__esModule = true;
var Nav_1 = require("./components/Nav");
function App() {
    return (React.createElement("div", null,
        React.createElement(Nav_1["default"], null),
        React.createElement("div", { className: "text-whitefont-bold text-center m-10 text-2xl" },
            React.createElement("div", null, "WELCOME TO MY BLOG"),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("div", null, "Please take a look at what I have been up too or post something yourself."),
            React.createElement("br", null),
            React.createElement("br", null),
            "To learn more this project check out the about tab.")));
}
exports["default"] = App;
