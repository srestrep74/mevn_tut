import express from 'express';
import cors from 'cors';
import MoviesRoute from './api/MoviesRoute.js';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import MoviesDAO from './dao/MoviesDAO.js';
import ReviewsDAO from './dao/ReviewsDAO.js';

class Index {
    static app = express();

    static router = express.Router();

    static main() {
        dotenv.config(); // Load env variables
        Index.setUpServer();
        Index.setUpDatabase();
    }

    static setUpServer() {
        Index.app.use(cors());
        Index.app.use(express.json());
        Index.app.use('/api/v1/movies', MoviesRoute.configRoutes(Index.router)); // Api route prefix
        Index.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Not Found' }); // Any other url gives 404 error
        });
    }

    static async setUpDatabase() {
        const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI); // Instance of mongodb client with our URI
        const port = process.env.PORT || 8000;

        try {
            await client.connect(); // Wait to connect with db
            await MoviesDAO.injectDB(client); // We call innjectDB to get a reference to movies collection
            await ReviewsDAO.injectDB(client); // Get reviews reference
            Index.app.listen(port, () => {
                console.log(`Server is running on port : ${port}`); // Starts the server
            });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
}

Index.main();