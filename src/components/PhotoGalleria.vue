<template>
    <Galleria
      :value="props.images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
    >
      <template #item="slotProps">
        <div class="image-container">
          <img
            :src="slotProps.item.itemImageSrc"
            :alt="slotProps.item.alt"
            class="main-image"
          />
          <Button 
            v-if="props.onAdministration"
            label="Șterge" 
            class="delete-button" 
            severity="danger"
            @click="handleDeleteImage(slotProps.item.itemImageSrc)" 
          />
        </div>
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" class="thumbnail-image" />
      </template>
    </Galleria>
    <ConfirmDialog />
    <Toast group="toast-group" />
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import { onBeforeMount } from "vue";
  import fetchApi from "../stores/fetch";
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import ConfirmDialog from "primevue/confirmdialog";
  import Toast from "primevue/toast";
  onBeforeMount(() => {
  });
  const emit = defineEmits(['refresh']);
  const toast = useToast();
  const confirm = useConfirm();
  const props = defineProps({
    images: {
      type: Array,
      required: true,
    },
    onAdministration: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
  const responsiveOptions = ref([
    {
      breakpoint: "1300px",
      numVisible: 4,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ]);
async function handleDeleteImage(imageUrl: string) {
  const payload = {
    imageUrl: imageUrl
  }
  try {
    confirm.require({
      message: 'Sunteți sigur că doriți să ștergeți această imagine?',
      header: 'Confirmare ștergere',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const result = await fetchApi(`ObjectiveImage/delete`, 'DELETE', undefined, payload);
        if (result.result === false) {
          toast.add({
            severity: 'error',
            summary: 'Eroare',
            detail: 'Nu s-a putut șterge imaginea',
            life: 3000,
            group: 'toast-group'
          });
        } else {
          toast.add({
            severity: 'success',
            summary: 'Succes',
            detail: 'Imaginea a fost ștearsă cu succes',
            life: 3000,
            group: 'toast-group'
          });
          emit('refresh');
        }
      }
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'A apărut o eroare la ștergerea imaginii',
      life: 3000
    });
  }
}
</script>
<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.main-image {
  width: 100%;
  display: block;
}

.delete-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.thumbnail-image {
  width: 100px;
  height: auto;
  object-fit: cover;
}
</style>