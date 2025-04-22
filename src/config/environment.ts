export default {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
    TOKEN_EXPIRY: process.env.TOKEN_EXPIRY || "24h",
};
