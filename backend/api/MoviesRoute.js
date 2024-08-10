import MoviesControler from './MoviesController.js';
import ReviewsController from './ReviewsController.js'

export default class MoviesRoute {

    // Use the express router defined in index.js to add routes
    static configRoutes(router) {

        // Root endpoint : Access a list of movies specifing some parameters such as title or rating
        router.route('/').get(MoviesControler.apiGetMovies);

        // Endpoint for Reviews
        router.route('/review')
            .post(ReviewsController.apiPostReview)
            .put(ReviewsController.apiUpdateReview)
            .delete(ReviewsController.apiDeleteReview)

        // Route to get specific movie with its reviews
        router.route('/id/:id').get(MoviesControler.apiGetMovieById);

        // Route to get all ratings
        router.route('/ratings').get(MoviesControler.apiGetRatings);


        return router;
    }
}