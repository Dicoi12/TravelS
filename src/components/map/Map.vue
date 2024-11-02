<template>
    <div class="map-container">
      <!-- Butonul pentru deschidere în Google Maps -->
      
      <!-- Harta OpenLayers -->
      <div ref="map" class="map"></div>
      <button class="open-in-maps-button" @click="openInGoogleMaps">
        Deschide în Google Maps
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import { fromLonLat } from 'ol/proj';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import { Style, Icon } from 'ol/style';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  
  const props = defineProps({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });
  
  const map = ref<Map>();
  
  function openInGoogleMaps() {
    const googleMapsUrl = `https://www.google.com/maps?q=${props.latitude},${props.longitude}`;
    window.open(googleMapsUrl, '_blank');
  }
  
  onMounted(() => {
    const coordinates = fromLonLat([props.longitude, props.latitude]);
  
    // Configurarea markerului
    const marker = new Feature({
      geometry: new Point(coordinates),
    });
  
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg', // Marcator roșu
        }),
      })
    );
  
    // Sursa și stratul vectorial pentru marker
    const vectorSource = new VectorSource({
      features: [marker],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
  
    // Configurarea hărții
    map.value = new Map({
      target: map.value as string | HTMLElement | undefined,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: coordinates,
        zoom: 13,
      }),
    });
  });
  </script>
  
  <style scoped>
  .map-container {
    position: relative;
    height: 400px;
    width: 100%;
  }
  
  .map {
    height: 100%;
    width: 100%;
  }
  
  .open-in-maps-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }
  
  .open-in-maps-button:hover {
    background-color: #357ae8;
  }
  </style>
  