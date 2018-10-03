const Http = require('http');
const Express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const HTTP_PORT = 80;
const HTTP_WEBROOT = './public';
const HTTP_MEDIAROOT = 'media';
const Logger = require('./nodeLogger');
const CookieParser = require('cookie-parser');
const Auth = require('./authMiddleware');
const hlsController = require('./hlsController');


class NodeHLSServer {
    constructor(config) {
        this.port = config.http.port = config.http.port ? config.http.port : HTTP_PORT;
        this.webroot = config.http.webroot = config.http.webroot ? config.http.webroot : HTTP_WEBROOT;
        this.mediaroot = config.http.mediaroot = config.http.mediaroot ? config.http.mediaroot : HTTP_MEDIAROOT;
        this.config = config;

        let app = Express();
        app.use(helmet());
        app.use(cors());
        app.use(CookieParser());

        /**
         * Add CORS
         */
        app.all(['*.m3u8', '*.ts'], (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', this.config.http.allow_origin);
            next();
        });

        /**
         * Authentication Middleware
         */
        app.use(Auth.ensureToken);

        /**
         * Serving media
         */
        app.use(hlsController.router);
        app.use(Express.static(this.mediaroot));

        /**
         * Error handler
         */
        app.use(function (err, req, res, next) {
            if (err) {
                Logger.error(err);
                res.send(err.message);
            } else {
                next();
            }
        });

        this.httpServer = Http.createServer(app);
    }
    run() {

        this.httpServer.listen(this.port, () => {
            Logger.log(`Node Media Http Server started on port: ${this.port}`);
        });

        this.httpServer.on('error', (e) => {
            Logger.error(`Node Media Http Server ${e}`);
        });

        this.httpServer.on('close', () => {
            Logger.log('Node Media Http Server Close.');
        });
    }

    stop() {
        this.httpServer.close();
    }
}

module.exports = NodeHLSServer;