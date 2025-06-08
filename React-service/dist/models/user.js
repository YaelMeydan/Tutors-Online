"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        select: false,
        set(newPassword) {
            if (!(this instanceof mongoose_1.Document)) {
                throw new Error();
            }
            return hashPasswordWithSalt(newPassword, this.get("createdAt"));
        },
    },
    fullName: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    methods: {
        isSamePassword(password) {
            const hash = hashPasswordWithSalt(password, this.get("createdAt"));
            return this.password === hash;
        }
    }
});
exports.User = (0, mongoose_1.model)("User", schema);
function hashPasswordWithSalt(password, salt) {
    const hash = (0, crypto_1.createHash)("sha512");
    hash.update(password);
    hash.update(salt.valueOf().toString());
    return hash.digest("base64");
}
