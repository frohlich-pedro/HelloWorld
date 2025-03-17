require('dotenv').config();
const http         = require('http');
const serveStatic  = require('serve-static');
const finalhandler = require('finalhandler');
const path         = require('path');
const morgan       = require('morgan');
const mysql        = require('mysql2');

class Server {
    constructor() {
        this.hostname = process.env.HOSTNAME;
        this.port     = process.env.PORT;
        this.dbHost   = process.env.DB_HOST;
        this.dbUser   = process.env.DB_USER;
        this.dbPass   = process.env.DB_PASS;
        this.dbName   = process.env.DB_NAME;
        this.serve    = serveStatic(path.join(__dirname, 'www'));
        this.logger   = morgan('combined');
        this.server   = http.createServer(this.requestHandler.bind(this));
        this.db       = this.setupDatabase();
        this.validateEnvironmentVariables();
    }

    validateEnvironmentVariables() {
        if (!this.hostname || !this.port || !this.dbHost || !this.dbUser || !this.dbPass || !this.dbName) {
            console.error("something isn't right, verify .env");
            process.exit(1);
        }
    }

    setupDatabase() {
        const connection = mysql.createConnection({
            host:     this.dbHost,
            user:     this.dbUser,
            password: this.dbPass,
            database: this.dbName
        });

        connection.connect((err) => {
            if (err) {
                console.error('Could not connect to MySQL:', err.message);
                process.exit(1);
            }
        });

        return connection;
    }

    requestHandler(req, res) {
        this.logger(req, res, (err) => {
            if (err) {
                this.sendError(res, 500, 'Internal server error');
                return;
            }
    
            this.serve(req, res, (err) => {
                if (err) {
                    this.sendError(res, 404, 'Not found');
                    return;
                }

                finalhandler(req, res)(err);
            });
        });
    }
    

    sendError(res, statusCode, message) {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(message);
    }

    start() {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });

        process.on('SIGINT', () => {
            this.db.end(() => {
                process.exit(0);
            });
        });
    }
}

const serverInstance = new Server();
serverInstance.start();