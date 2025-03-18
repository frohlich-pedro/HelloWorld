require('dotenv').config();
const http         = require('http');
const serveStatic  = require('serve-static');
const finalhandler = require('finalhandler');
const path         = require('path');
const morgan       = require('morgan');
const mysql        = require('mysql2/promise');
const helmet       = require('helmet');
const { cleanEnv, str, port } = require('envalid');

class Server {
    constructor() {
        this.env      = this.validateEnvironmentVariables();
        this.hostname = this.env.HOSTNAME;
        this.port     = this.env.PORT;
        this.dbHost   = this.env.DB_HOST;
        this.dbUser   = this.env.DB_USER;
        this.dbPass   = this.env.DB_PASS;
        this.dbName   = this.env.DB_NAME;
        this.serve    = serveStatic(path.join(__dirname, 'www'));
        this.logger   = morgan('combined');
        this.server   = http.createServer(this.requestHandler.bind(this));
        this.db       = this.setupDatabase();
    }

    validateEnvironmentVariables() {
        return cleanEnv(process.env, {
            HOSTNAME: str(),
            PORT:     port(),
            DB_HOST:  str(),
            DB_USER:  str(),
            DB_PASS:  str(),
            DB_NAME:  str()
        });
    }

    async setupDatabase() {
        const pool = mysql.createPool({
            host:     this.dbHost,
            user:     this.dbUser,
            password: this.dbPass,
            database: this.dbName
        });

        try {
            const connection = await pool.getConnection();
            console.log('Connected to MySQL!');
            connection.release();
        } catch (err) {
            console.error('Could not connect to MySQL:', err.message);
            process.exit(1);
        }

        return pool;
    }

    requestHandler(req, res) {
        this.logger(req, res, (err) => {
            if (err) {
                this.sendError(res, 500, 'Internal server error');
                return;
            }

            helmet()(req, res, (err) => {
                if (err) {
                    this.sendError(res, 500, 'Error applying security headers');
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
        });
    }

    sendError(res, statusCode, message) {
        const errorPage = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error ${statusCode}</title>
            </head>
            <body>
                <h1>Error ${statusCode}: ${message}</h1>
            </body>
            </html>
        `;

        res.writeHead(statusCode, { 'Content-Type': 'text/html' });
        res.end(errorPage);
    }

    start() {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    
        process.on('SIGINT', async () => {
            console.log('Shutting down gracefully...');
            if (this.db && typeof this.db.end === 'function') {
                try {
                    await this.db.end();
                    console.log('Database connection closed.');
                } catch (err) {
                    console.error('Error while closing database connection:', err.message);
                }
            }

            process.exit(0);
        });
    }    
}

const serverInstance = new Server();
serverInstance.start();