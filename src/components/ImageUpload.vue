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

const selectedFile = ref(null);
const uploadStatus = ref("");
const props = defineProps({
  idObiectiv: { type: Number, required: false,default:null },
});

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = "";
  }
};
const uploadFile = async () => {
  if (!selectedFile.value) return;
  let formData = new FormData();
  formData.append("imageFile", selectedFile.value);

  try {
    await fetchApi(
      `ObjectiveImage/${props.idObiectiv}/upload`,
      "POST",
      formData,
      undefined,
      true
    );
    uploadStatus.value = "File uploaded successfully!";
  } catch (error) {
    console.log(formData);
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
