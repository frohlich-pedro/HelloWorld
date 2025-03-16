require('dotenv').config();
const http         = require('http');
const serveStatic  = require('serve-static');
const finalhandler = require('finalhandler');
const path         = require('path');
const morgan       = require('morgan');

class Server {
    constructor() {
        this.hostname = process.env.HOSTNAME;
        this.port     = process.env.PORT;
        this.serve    = serveStatic(path.join(__dirname, 'www'));
        this.logger   = morgan('combined');
        this.server   = http.createServer(this.requestHandler.bind(this));
        this.validateEnvironmentVariables();
    }

    validateEnvironmentVariables() {
        if (!this.hostname || !this.port) {
            console.error("HOSTNAME and PORT must be defined in .env");
            process.exit(1);
        }
    }

    requestHandler(req, res) {
        this.logger(req, res, (err) => {
            if (err) {
                this.sendError(res, 500, "Internal server error");
                return;
            }

            this.serve(req, res, (err) => {
                if (err) {
                    this.sendError(res, 404, "Not found");
                    return;
                }

                finalhandler(req, res)(err);
            });
        });
    }

    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { "Content-Type": "text/plain" });
        res.end(message);
    }

    start() {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }
}

const serverInstance = new Server();
serverInstance.start();