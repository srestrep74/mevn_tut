import mongodb from 'mongodb';

export default class ReviewsDAO {
    static reviews;

    static objectId = mongodb.ObjectId; // We need access to mongodb ObjectId that allow us convert an id string to a mongodb ObjectId

    static async injectDB(conn) {
        if (ReviewsDAO.reviews) {
            return;
        }

        try {
            // Creates the reference reviews to the collection reviews. If this one doesn't exists, mongodb create it for us.
            ReviewsDAO.reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews');
        } catch (e) {
            console.error(`Unable to establish connection handle in reviewDAO : ${e}`);
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            // Create new review document
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date,
                review,
                movie_id: new ReviewsDAO.objectId(movieId),
            };

            // Use the reference to use the method insertOne
            return await ReviewsDAO.reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review : ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await ReviewsDAO.reviews.updateOne(
                // Filter for an existing review created by userId and reviewId
                {
                    user_id: userId,
                    _id: new ReviewsDAO.objectId(reviewId)
                },
                // If doesn't exists, create a new review 
                {
                    $set: { review, date },
                },
            );

            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review : ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await ReviewsDAO.reviews.deleteOne(
                // Deletes the review with reviewId and created by user_id
                {
                    _id: new ReviewsDAO.objectId(reviewId),
                    user_id: userId,
                }
            );
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review : ${e}`);
            return { error: e };
        }
    }
}