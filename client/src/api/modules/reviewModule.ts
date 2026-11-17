import axiosClient from "../client/axiosClient";
import { Review } from "../../types";

const reviewEndpoints = {
  listReviews: "reviews",
  create: "reviews",
  remove: (id_review: number) => `reviews/${id_review}`,
};

interface CreateReviewParams {
  id_user: number;
  id_media: number;
  rating_user: number;
  comment_text: string;
}

interface RemoveReviewParams {
  id_review: number;
}

const reviewModule = {
  create: async (data: CreateReviewParams): Promise<{ response?: Review; err?: any }> => {
    try {
      const response = await axiosClient.post<Review>(reviewEndpoints.create, data);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async ({ id_review }: RemoveReviewParams): Promise<{ response?: any; err?: any }> => {
    try {
      const response = await axiosClient.delete(reviewEndpoints.remove(id_review));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getReviewsOfUser: async (): Promise<{ response?: Review[]; err?: any }> => {
    try {
      const response = await axiosClient.get<Review[]>(reviewEndpoints.listReviews);
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default reviewModule;