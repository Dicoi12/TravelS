<template>
  <div>
    <input type="file" @change="handleFileChange" accept="image/*" />
    <button :disabled="!selectedFile" @click="uploadFile">Upload</button>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useObjectivesStore } from "../stores/objectivesStore";
import fetchApi from "../stores/fetch";

const selectedFile = ref(null);
const uploadStatus = ref("");
const objectivesStore=useObjectivesStore();

const handleFileChange = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    uploadStatus.value = "";
    console.log(file);
  }
};
const uploadFile = async () => {
      if (!selectedFile.value) return;
      console.log(selectedFile.value)
      let formData = new FormData();
      formData.append("imageFile", selectedFile.value);

      try {
        const response = await fetchApi(
          `ObjectiveImage/1/upload`,
          "POST",
          formData,
          undefined,
          true
        );
        uploadStatus.value = "File uploaded successfully!";
        console.log(response);
    } catch (error) {
          console.log(formData)
        uploadStatus.value = "Error uploading file.";
        console.error(error);
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
