import MoviesDAO from '../dao/MoviesDAO.js';

export default class MoviesControler {
    static async apiGetMovies(req, res, next) {

        /*
        When the apiGetMovies is called via url, there will be a query string in the request object (req.query) wherecertainfilter parametersmight be specified and  passed in through key-value pairs.

        For example : 
        http://localhost:5000/api/v1/movies?title=dragon&moviesPerPage=15&page=0
        
        */

        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        const filters = {};
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.title = req.query.title;
        }

        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies(
            { filters, page, moviesPerPage },
        );

        const response = {
            movies: moviesList,
            page,
            filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        };

        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {
        try {
            /*
                Check for an id parameter int he url : 
                localhost:5000/api/v1/movies/id/12345
            */
            const id = req.params.id || {};
            const movie = await MoviesDAO.getMovieById(id);

            if (!movie) {
                res.status(404).json({ error: 'Not Found' });
                return;
            }

            res.json(movie);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            const propertyTypes = await MoviesDAO.getRatings();
            res.json(propertyTypes);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
}