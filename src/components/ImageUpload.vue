<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button :disabled="!selectedFile" @click="uploadFile">Upload</button>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import fetchApi from "../stores/fetch";

const emits = defineEmits(["uploaded"]);
const selectedFile = ref(null);
const uploadStatus = ref("");
const props = defineProps({
  idObiectiv: { type: Number, required: false, default: null },
  idEveniment: { type: Number, required: false, default: null },
});

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = "";
  }
};
const uploadFile = async () => {
  console.log(props.idEveniment);
  if (!selectedFile.value) return;
  let formData = new FormData();
  formData.append("imageFile", selectedFile.value);

  let url = 'ObjectiveImage/upload';
  const params = new URLSearchParams();
  
  if (props.idObiectiv !== null) {
    params.append('objectiveId', props.idObiectiv.toString());
  }
  if (props.idEveniment !== null) {
    params.append('eventId', props.idEveniment.toString());
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  try {
    const response = await fetchApi(
      url,
      "POST",
      formData,
      undefined,
      true
    );
    uploadStatus.value = "File uploaded successfully!";
    if (response.isSuccessful) {
      emits("uploaded");
    }
  } catch (error) {
    uploadStatus.value = "Error uploading file.";
  }
};
</script>
<style scoped>
input[type="file"] {
  margin-bottom: 10px;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

p {
  margin-top: 10px;
  font-weight: bold;
}
</style>
