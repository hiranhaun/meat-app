import { Key } from "selenium-webdriver";

export class User {
    constructor (public email: string, 
                 public name: string,
                 private password: string) {}

    matches(another: User): boolean {
        return another != undefined && another.email === this.email && another.password === this.password;
    }
}

export const users: {[Key: string]: User} = {
    "thaiserubeny@gmail.com": new User('thaiserubeny@gmail.com', 'Thaise', 'thaise'),
    "hiran.unit@gmail.com": new User('hiran.unit@gmail.com', 'Hiran', 'hiran')
}