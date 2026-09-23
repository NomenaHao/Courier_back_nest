"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDjangoPassword = verifyDjangoPassword;
exports.hashDjangoPassword = hashDjangoPassword;
const crypto = __importStar(require("crypto"));
const DJANGO_ITERATIONS = 600000;
function verifyDjangoPassword(password, encoded) {
    const parts = encoded.split('$');
    if (parts.length !== 4)
        return false;
    const [algorithm, iterationsStr, salt, digest] = parts;
    if (algorithm !== 'pbkdf2_sha256')
        return false;
    const iterations = parseInt(iterationsStr, 10);
    const derived = crypto
        .pbkdf2Sync(password, salt, iterations, 32, 'sha256')
        .toString('base64');
    try {
        return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(digest));
    }
    catch {
        return false;
    }
}
function hashDjangoPassword(password) {
    const salt = crypto.randomBytes(16).toString('base64url').slice(0, 22);
    const hash = crypto
        .pbkdf2Sync(password, salt, DJANGO_ITERATIONS, 32, 'sha256')
        .toString('base64');
    return `pbkdf2_sha256$${DJANGO_ITERATIONS}$${salt}$${hash}`;
}
//# sourceMappingURL=django-password.js.map