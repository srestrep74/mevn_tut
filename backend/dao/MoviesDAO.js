import mongodb from 'mongodb';

export default class MoviesDAO {
    static movies; // Stores the reference to the db

    static objectId = mongodb.ObjectId;

    static async injectDB(conn) { // Is called as soon as the erver starts and provides the db reference to movies collection
        if (MoviesDAO.movies) {
            return;
        }

        try {
            MoviesDAO.movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection('movies');
        } catch (e) {
            console.error(`Unable to connect in MoviesDAO : ${e}`);
        }
    }

    // Accepts an filter object as its first argument.
    // The default filter has no filters, retrieves at page 0 and retrieves 20 movies per page.
    // We provide filtering results by mobie title and movie rating.
    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20, // Will only get 20 movies at once
    } = {}) {
        let query;
        if (filters) {
            if ('title' in filters) {
                query = { $text: { $search: filters.title } };
            } else if ('rated' in filters) {
                query = { rated: { $eq: filters.rated } };
            }
        }

        let cursor;
        try {
            // Create the cursor to fetch data in batches like pagination
            cursor = await MoviesDAO.movies.find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page);

            const moviesList = await cursor.toArray();
            const totalNumMovies = await MoviesDAO.movies.countDocuments(query);

            return { moviesList, totalNumMovies };
        } catch (e) {
            console.error(`Unable to issue find command : ${e}`);
            return { moviesList: [], totalNumMovies: 0 };
        }
    }

    static async getRatings() {
        let ratings = [];

        try {
            // Obtain all distinct rated values
            ratings = await MoviesDAO.movies.distinct('rated');
            return ratings;
        } catch (e) {
            console.error('Unable to get ratings');
            return ratings;
        }
    }

    static async getMovieById(id) {
        try {
            // Use aggregate method to provide a sequence of data aggregation operations
            return await MoviesDAO.movies.aggregate(
                [
                    {
                        // Look for the movie document that matches the specified id
                        $match: {
                            _id: new MoviesDAO.objectId(id),
                        },
                    },
                    {
                        // Join operation using _id field from the movie document with the movie_id field from reviews collection
                        $lookup: {
                            from: 'reviews', // Collection to join
                            localField: '_id', // Field from the input document (movie)
                            foreignField: 'movie_id', // Field from the documents of the "from" collection (review)
                            as: 'reviews', // Ouput array field
                        },
                    },
                ]
            ).next();
        } catch (e) {
            console.error("Something went wrong in getMovieById");
            throw e;
        }
    }
}