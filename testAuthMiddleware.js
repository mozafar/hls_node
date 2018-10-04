const JsonWebToken = require('jsonwebtoken');
const { UnauthorizedError } = require('./erros');
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root@mysql',
    database: 'parspack',
});

const tokenName = 'jwt';

function ensureToken(req, res, next) {
    // if (!req.cookies) {
    //     return next(new Error('Unauthorized access.'));
    // }
    // if (!req.cookies[tokenName]) {
    //     next(new Error('Unauthorized access.'));
    //     return;            
    // }
    let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwYXJzcGFjayIsInN1YiI6ImhscyIsImF1ZCI6InVzZXJzIiwiaWF0IjoxNTM4NjQwMTE2LCJleHAiOjE1Mzg3MjY1MTYsInVpZCI6MX0.CHnC_6ud-V3UZrOGpGIR0GzDQMSu0Gv-ZC9qTX4231E';
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