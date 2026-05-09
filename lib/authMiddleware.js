import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyAuth = (request) => {
    try {
        if (!JWT_SECRET) {
            return { valid: false };
        }

        const authHeader =
            request.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return { valid: false };
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return { valid: false };
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return {
            valid: true,
            user: decoded,
        };
    } catch {
        return { valid: false };
    }
};