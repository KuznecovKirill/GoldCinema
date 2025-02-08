import privateClient from "../client/private.client";

const reviewEndpoints = {
  listReviews: "reviews",
  create: "reviews",
  remove: ({ id_review }) => `reviews/${id_review}`
};

const reviewModule = {
  create: async ({
    id_media,
    rating,
    comment
  }) => {
    try {
      const response = await privateClient.post(
        reviewEndpoints.create,
        {
          id_media,
          rating,
          comment
        }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ id_review }) => {
    try {
      const response = await privateClient.delete(reviewEndpoints.remove({ id_review }));

      return { response };
    } catch (err) { return { err }; }
  },
  getReviewsOfUser: async () => {
    try {
      const response = await privateClient.get(reviewEndpoints.listReviews);
      return { response };
    } catch (err) { return { err }; }
  }
};

export default reviewModule;