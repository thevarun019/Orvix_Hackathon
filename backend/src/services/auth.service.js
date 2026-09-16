"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (existingUser)
        throw new Error('Email already in use');
    const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: data.role || 'CITIZEN'
        }
    });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error('Invalid credentials');
    const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isValid)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.service.js.map