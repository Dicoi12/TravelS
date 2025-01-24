<template>
  <div class="objective-detail-container">
    <!-- Secțiunea de imagini -->
    <div class="images-section">
      <img 
        :src="objectiveStore.selectedObjective.images[0] || 'https://via.placeholder.com/800x500?text=No+Image'" 
        alt="Imagine principală obiectiv"
        class="main-image"
      />
      <div class="thumbnail-container">
        <img 
          v-for="(image, index) in objective?.images?.slice(1)" 
          :key="index"
          :src="image"
          alt="Imagine obiectiv"
          class="thumbnail"
        />
      </div>
    </div>

    <!-- Secțiunea de detalii -->
    <div class="details-section">
      <h1>{{ objective?.name }}</h1>
      
      <div class="objective-meta">
        <div class="meta-item">
          <i class="pi pi-clock"></i>
          <span>Program: {{ objective?.schedule }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ objective?.address }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-ticket"></i>
          <span>Preț: {{ objective?.price }} RON</span>
        </div>
      </div>

      <div class="description">
        <h2>Descriere</h2>
        <p>{{ objective?.description }}</p>
      </div>

      <div class="additional-info">
        <h2>Informații suplimentare</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Categorie:</strong> {{ objective?.category }}
          </div>
          <div class="info-item">
            <strong>Rating:</strong>
            <span class="stars-container">
              <i v-for="index in 5" 
                 :key="index" 
                 class="pi" 
                 :class="index <= objective?.rating ? 'pi-star-fill' : 'pi-star'" 
                 style="color: gold;">
              </i>
              <span>({{ objective?.rating }}/5)</span>
            </span>
          </div>
          <div class="info-item">
            <strong>Website:</strong> 
            <a :href="objective?.website" target="_blank" rel="noopener noreferrer">
              {{ objective?.website }}
            </a>
          </div>
        </div>
      </div>

      <!-- Harta Google Maps -->
      <div class="map-container">
        <h2>Locație</h2>
        <iframe
          width="100%"
          height="400"
          style="border:0"
          loading="lazy"
          allowfullscreen
          :src="`https://www.google.com/maps?q=${objective?.latitude},${objective?.longitude}&output=embed`"
        ></iframe>
      </div>

      <!-- Secțiunea de review-uri -->
      <div class="reviews-section">
        <h2>Review-uri</h2>
        <div v-if="reviews.length">
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <strong>{{ review.user.userName }}</strong>
            <span>{{ review.createdAt }}</span>
            <div>
              <strong>Rating:</strong>
              <span class="stars-container">
                <i v-for="index in 5" 
                   :key="index" 
                   class="pi" 
                   :class="index <= review.raiting ? 'pi-star-fill' : 'pi-star'" 
                   style="color: gold;">
                </i>
                <span>({{ review.raiting }}/5)</span>
              </span>
            </div>
            <p>{{ review.comment }}</p>
          </div>
        </div>
        <div v-else>
          <p>Nu există review-uri pentru acest obiectiv.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useObjectivesStore } from '../../stores/objectivesStore';
import { useReviewsStore } from '../../stores/reviewsStore';
import { IReview } from '../../Interfaces';
import { onBeforeMount } from 'vue';

const route = useRoute();
const objectiveStore = useObjectivesStore();
const reviewsStore = useReviewsStore();
const objective = ref();
const reviews = ref<IReview[]>([]);

onBeforeMount(async () => {
  const objectiveId = route.params.id;
  await objectiveStore.getById(parseInt(objectiveId as string));
  objective.value = objectiveStore.selectedObjective;
  
  reviews.value = await reviewsStore.getByObjectiveId(parseInt(objectiveId as string));
});

</script>

<style scoped>
.objective-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: white;
}

.images-section {
  margin-bottom: 2rem;
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.thumbnail-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.thumbnail {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.details-section {
  background: #666666;
  padding: 2rem;
  border-radius: 8px;
}

.objective-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 1rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.description {
  margin: 2rem 0;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.info-item a {
  color: #4CAF50;
  text-decoration: none;
}

.info-item a:hover {
  text-decoration: underline;
}

.map-container {
  margin-top: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .objective-detail-container {
    margin: 1rem;
  }

  .main-image {
    height: 300px;
  }

  .details-section {
    padding: 1rem;
  }

  .objective-meta {
    gap: 1rem;
  }
}

.reviews-section {
  margin-top: 2rem;
  background: #444;
  padding: 1rem;
  border-radius: 8px;
}

.review-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.review-item strong {
  display: block;
  margin-bottom: 0.5rem;
}

.review-item span {
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 0.5rem;
  display: block;
}

.stars-container {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 10px;
}

.stars-container i {
  font-size: 1.2rem;
}

.stars-container span {
  margin-left: 8px;
}
</style>
