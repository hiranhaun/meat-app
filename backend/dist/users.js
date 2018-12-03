"use strict";
exports.__esModule = true;
var User = /** @class */ (function () {
    function User(email, name, password) {
        this.email = email;
        this.name = name;
        this.password = password;
    }
    User.prototype.matches = function (another) {
        return another != undefined && another.email === this.email && another.password === this.password;
    };
    return User;
}());
exports.User = User;
exports.users = {
    "thaiserubeny@gmail.com": new User('thaiserubeny@gmail.com', 'Thaise', 'thaise'),
    "hiran.unit@gmail.com": new User('hiran.unit@gmail.com', 'Hiran', 'hiran')
};
