<template>
    <Galleria
      :value="props.images"
      :responsiveOptions="responsiveOptions"
      :numVisible="5"
      containerStyle="max-width: 640px"
    >
      <template #item="slotProps">
        <img
          :src="slotProps.item.itemImageSrc"
          :alt="slotProps.item.alt"
          style="width: 100%"
        />
        <Button v-if="props.onAdministration" icon="pi pi-trash" @click="handleDeleteImage(slotProps.item.itemImageSrc)" />
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" width="100px" />
      </template>
    </Galleria>
  </template>
  <script setup lang="ts">
  import { ref } from "vue";
  import { onBeforeMount } from "vue";
  import fetchApi from "../stores/fetch";
  import { useConfirm } from "primevue/useconfirm";
  onBeforeMount(() => {
  });
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
  try {
    // Extragem GUID-ul din URL-ul complet
    const guidWithExtension = imageUrl.split('/').pop(); // Obține "200067cc-ee8f-4f1f-af6f-7ff605ffe59f.png"
    const guid = guidWithExtension?.split('.')[0]; // Obține "200067cc-ee8f-4f1f-af6f-7ff605ffe59f"

    if (!guid) {
      throw new Error('Nu s-a putut extrage GUID-ul imaginii');
    }

    // Adăugăm dialog de confirmare
    confirm.require({
      message: 'Sunteți sigur că doriți să ștergeți această imagine?',
      header: 'Confirmare ștergere',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await fetchApi(`ObjectiveImage/DeleteImage/${guid}`, 'DELETE');
        
      }
    });

  } catch (error) {
    console.error('Eroare la ștergerea imaginii:', error);
  }
}
</script>