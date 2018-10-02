const JsonWebToken = require('jsonwebtoken');
const { UnauthorizedError } = require('./erros');
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root@mysql',
    database: 'parspack',
    connectionLimit: 300,
});

const tokenName = 'jwt';

function ensureToken(req, res, next) {
    if (!req.cookies) {
        return next(new Error('Unauthorized access.'));
    }
    if (!req.cookies[tokenName]) {
        next(new Error('Unauthorized access.'));
        return;            
    }
    let token = req.cookies[tokenName];
    JsonWebToken.verify(token, 's3cr3t', {
        issuer : 'parspack',
        subject: 'hls', 
        audience: 'users',
    },
    (error, payload) => {
        try {
            if ((typeof error !== 'undefined') && (error !== null)) {
                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedError('Token Expired.');
                }
                if (error.name === 'JsonWebTokenError') {
                    throw new UnauthorizedError('Token Error.');
                } else {
                    throw error;
                }
            }
            pool.query('SELECT * FROM users WHERE id = ?', payload.uid, function (err, rows) {                
                if (err || !rows) {
                    throw new UnauthorizedError('Unauthorized access.');
                }
            });
            next();            

        } catch (error) {
            next(error);
        }
    });
}


exports.ensureToken = ensureToken;