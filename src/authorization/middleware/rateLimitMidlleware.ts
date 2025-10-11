import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = rateLimit({
    windowMs: 10 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: true,
    handler: (_, res) => res.sendStatus(429),
    validate: {
        trustProxy: false,
    },
});

export const loginLimiter = rateLimit({
    windowMs: 10000,
    limit: 5,
    handler: (_, res) => res.sendStatus(429),
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});

export const emailReserndingLimiter = rateLimit({
    windowMs: 10000,
    limit: 5,
    handler: (_, res) => res.sendStatus(429),
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
});



