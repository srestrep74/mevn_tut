import ReviewsDAO from '../dao/ReviewsDAO.js'

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {

            // Get data from the body
            const movieId = req.body.movie_id;
            const { review } = req.body;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            };

            const date = new Date();

            // Pass this data to the add method in ReviewsDAO
            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date,
            );

            // Return success if the add method was good
            res.json({ status: 'Success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const { review } = req.body;

            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, // This id ensures that the user who is updatind the review is the one who has created it.
                review,
                date,
            );

            const { error } = reviewResponse;
            if (error) {
                res.status(500).json({ error });
                return;
            }

            // The updateReview method, returns an object reviewResponse which contains the property modifiedCount.
            // If the count is zero, means the review has not been updated.
            if (reviewResponse.modifiedCount === 0) {
                throw new Error('Unable to update review. User mey not be original poster');
            }
            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const userId = req.body.user_id;

            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            );

            res.json({ status: 'success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

