import { defineStore } from 'pinia';
import fetchApi from './fetch';

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    reviews: [] as Array<any>,
  }),
  actions: {
    async getByObjectiveId(objectiveId: number) {
      try {
        const response = await fetchApi(`review/objective/${objectiveId}`, 'GET');
        this.reviews = response;
        return this.reviews;
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
      }
    },
    async addReview(review: any) {
      try {
        const response = await fetchApi('review', 'POST', review);
        this.reviews.push(response);
      } catch (error) {
        console.error('Failed to add review:', error);
      }
    },
    async deleteReview(id: number) {
      try {
        await fetchApi(`review/${id}`, 'DELETE');
        this.reviews = this.reviews.filter(review => review.id !== id);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  }
});
