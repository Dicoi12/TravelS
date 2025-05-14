<template>
  <div class="objective-detail-container">
    <div class="images-section">
      <div class="thumbnail-container">
        <PhotoCarousel
         :photos="objectiveStore.selectedObjective.images"
        />
      </div>
    </div>

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

      <div class="reviews-section">
        <h2>Review-uri</h2>
        <ScrollPanel style="width: 100%; height: 400px" class="custombar1">
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
        </ScrollPanel>

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

      <div class="recommended-objectives" v-if="recommendedObjectives.length > 0">
        <h2>Obiective Recomandate</h2>
        <div class="recommended-grid">
          <div v-for="obj in recommendedObjectives" :key="obj.id" class="recommended-item" @click="async () => { 
            await router.push(`/objectives/${obj.id}`);
            await scrollToTop();
          }">
            <img :src="obj.firstImageUrl || ''" :alt="obj.name" class="recommended-image" />
            <div class="recommended-info">
              <h3>{{ obj.name }}</h3>
              <p>{{ obj.city }}</p>
              <div class="stars-container">
                <i
                  v-for="index in 5"
                  :key="index"
                  class="pi"
                  :class="index <= (obj.averageRating || 0) ? 'pi-star-fill' : 'pi-star'"
                  style="color: gold"
                ></i>
                <span>({{ (obj.averageRating || 0).toFixed(1) }}/5)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast group="w" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { RecommendedObjectiveDto, useObjectivesStore } from "../../stores/objectivesStore";
import { useReviewsStore } from "../../stores/reviewsStore";
import { IReview } from "../../Interfaces";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import ScrollPanel from 'primevue/scrollpanel';
import { useHelperStore } from "../../stores/helperStore";
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const objectiveStore = useObjectivesStore();
const reviewsStore = useReviewsStore();
const userStore = useUserStore();
const objective = ref();
const reviews = ref<IReview[]>([]);
const recommendedObjectives = ref<RecommendedObjectiveDto[]>([]);
const helperStore = useHelperStore();
const newReview = ref<IReview>({
  raiting: 0,
  comment: "",
  idUser: userStore.userData.id ?? 1,
  idObjective: parseInt(route.params.id as string),
});
const toast = useToast();

const loadObjectiveData = async (objectiveId: string) => {
  await objectiveStore.getById(parseInt(objectiveId));
  objective.value = objectiveStore.selectedObjective;

  reviews.value = await reviewsStore.getByObjectiveId(
    parseInt(objectiveId)
  );

  try {
    await objectiveStore.recommendObjectives(parseInt(objectiveId));
    recommendedObjectives.value = objectiveStore.recommendedObjectives;
  } catch (error) {
    console.error('Eroare la obținerea obiectivelor recomandate:', error);
  }

  // Scroll la începutul paginii
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onBeforeMount(async () => {
  await loadObjectiveData(route.params.id as string);
});

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadObjectiveData(newId as string);
  }
});

onBeforeUnmount(()=>{
  objectiveStore.selectedObjective = {
    id: 0,
    name: "",
    type: 0,
    city: "",
    description: "",
    latitude: 0,
    longitude: 0,
    images: [],
    distance: 0,
    medieReview: 0,
    createdAt: new Date(),
  };
})
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

const scrollToTop = async () => {
  await nextTick();
  const scrollOptions: ScrollToOptions = {
    top: 0,
    left: 0,
    behavior: 'smooth' as ScrollBehavior
  };
  
  try {
    window.scrollTo(scrollOptions);
    document.documentElement.scrollTo(scrollOptions);
    document.body.scrollTo(scrollOptions);
  } catch (error) {
    console.error('Eroare la scroll:', error);
  }
};

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

.recommended-objectives {
  margin-top: 2rem;
  background: #444;
  padding: 1rem;
  border-radius: 8px;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.recommended-item {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  position: relative;
}

.recommended-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.recommended-item::after {
  content: 'Click pentru detalii';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1;
}

.recommended-item:hover::after {
  opacity: 1;
}

.recommended-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recommended-info {
  padding: 1rem;
  position: relative;
  z-index: 0;
}

.recommended-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recommended-info p {
  color: #ccc;
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 2.8em;
}

.custombar1 .p-scrollpanel-wrapper {
  border-right: 10px solid #444;
}

.custombar1 .p-scrollpanel-bar {
  background-color: #666;
  opacity: 1;
  transition: background-color .2s;
}

.custombar1 .p-scrollpanel-bar:hover {
  background-color: #888;
}
</style>
