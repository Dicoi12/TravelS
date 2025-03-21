<template>
  <div class="objective-detail-container">
    <!-- Secțiunea de imagini -->
    <div class="images-section">
      <div class="thumbnail-container">
        <PhotoCarousel
         :photos="objectiveStore.selectedObjective.images"
        />
      </div>
    </div>

    <!-- Secțiunea de detalii -->
    <div class="details-section">
      <h1>{{ objective?.name }}</h1>

      <div class="objective-meta">
        <div class="meta-item">
          <i class="pi pi-clock"></i>
          <span>Program: {{ objective?.interval }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ objective?.city }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-ticket"></i>
          <span>Preț: {{ objective?.pret }} RON</span>
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
            <strong>Categorie:</strong> {{ objective?.objectiveType?.name }}
          </div>
          <div class="info-item">
            <strong>Rating:</strong>
            <span class="stars-container">
              <i
                v-for="index in 5"
                :key="index"
                class="pi"
                :class="
                  index <= objective?.medieReview ? 'pi-star-fill' : 'pi-star'
                "
                style="color: gold"
              >
              </i>
              <span>({{ objective?.rating }}/5)</span>
            </span>
          </div>
          <div class="info-item" v-if="objective?.website">
            <strong>Website: </strong>
            <a
              :href="
                objective.website?objective?.website.startsWith('http')
                  ? objective.website
                  : `http://${objective.website}`:''
              "
              target="_blank"
              rel="noopener noreferrer"
            >
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
          style="border: 0"
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
            <strong>{{ review.user?.userName }}</strong>
            <span>{{ helperStore.formatDate(review.createdAt) }}</span>
            <div>
              <strong>Rating:</strong>
              <span class="stars-container">
                <i
                  v-for="index in 5"
                  :key="index"
                  class="pi"
                  :class="index <= review.raiting ? 'pi-star-fill' : 'pi-star'"
                  style="color: gold"
                >
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

        <!-- Formular pentru adăugare review -->
        <div class="add-review w-full">
          <h2>Adaugă un review</h2>
          <div class="my-3">
            <label for="rating">Rating:</label>
            <Rating v-model="newReview.raiting" />
          </div>
          <div>
            <label for="comment">Comentariu:</label>
            <Textarea
              class="w-full"
              id="comment"
              v-model="newReview.comment"
            ></Textarea>
          </div>
          <Button @click="submitReview()" class="w-full align-self-end my-2"
            >Trimite Review</Button
          >
        </div>
      </div>
    </div>
    <Toast group="w" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useObjectivesStore } from "../../stores/objectivesStore";
import { useReviewsStore } from "../../stores/reviewsStore";
import { IReview } from "../../Interfaces";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { useHelperStore } from "../../stores/helperStore";

const route = useRoute();
const objectiveStore = useObjectivesStore();
const reviewsStore = useReviewsStore();
const userStore = useUserStore();
const objective = ref();
const reviews = ref<IReview[]>([]);
const helperStore = useHelperStore();
const newReview = ref<IReview>({
  raiting: 0,
  comment: "",
  idUser: userStore.userData.id ?? 1,
  idObjective: parseInt(route.params.id as string),
});
const toast = useToast();

onBeforeMount(async () => {
  const objectiveId = route.params.id;
  await objectiveStore.getById(parseInt(objectiveId as string));
  objective.value = objectiveStore.selectedObjective;

  reviews.value = await reviewsStore.getByObjectiveId(
    parseInt(objectiveId as string)
  );
});
async function submitReview() {
  if (newReview.value.raiting === 0) {
    toast.add({
      severity: "warn",
      summary: "Eroare",
      detail: "Selectează un rating!",
      group: "w",
      life: 5000,
    });
    return;
  }
  if (newReview.value.comment === "") {
    toast.add({
      severity: "warn",
      summary: "Eroare",
      detail: "Completarea comentariului este obligatorie!",
      group: "w",
      life: 5000,
    });
    return;
  }
  await reviewsStore.addReview(newReview.value);
  newReview.value = {
    raiting: 0,
    comment: "",
    idUser: userStore.userData.id ?? 1,
    idObjective: parseInt(route.params.id as string),
  };
}
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
  color: #4caf50;
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
