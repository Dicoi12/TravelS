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
import { onMounted, ref, watch } from 'vue';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Geometry from 'ol/geom/Geometry';

const props = defineProps({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  isSelectable: { type: Boolean, default: false }
});
const emit = defineEmits(['coordinatesSelected']);

const map = ref<Map>();
let marker: Feature | null = null;
let vectorSource: VectorSource | null = null;

function openInGoogleMaps() {
  const googleMapsUrl = `https://www.google.com/maps?q=${props.latitude},${props.longitude}`;
  window.open(googleMapsUrl, '_blank');
}

function updateMarker(coordinates: number[]) {
  if (!vectorSource) return;
  if (marker) {
    marker.setGeometry(new Point(coordinates));
  } else {
    marker = new Feature({
      geometry: new Point(coordinates),
    });
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg',
        }),
      })
    );
    vectorSource.addFeature(marker);
  }
}

onMounted(() => {
  const coordinates = fromLonLat([props.longitude, props.latitude]);
  vectorSource = new VectorSource<Feature<Geometry>>({ features: [] });
  const vectorLayer = new VectorLayer({ source: vectorSource });

  map.value = new Map({
    target: map.value as string | HTMLElement | undefined,
    layers: [
      new TileLayer({ source: new OSM() }),
      vectorLayer,
    ],
    view: new View({
      center: coordinates,
      zoom: 13,
    }),
  });

  if (props.isSelectable) {
    map.value.on('click', (event) => {
      const [lon, lat] = toLonLat(event.coordinate);
      updateMarker(event.coordinate);
      emit('coordinatesSelected', { latitude: lat, longitude: lon });
    });
  }

  updateMarker(coordinates);
});

watch(() => [props.latitude, props.longitude], ([newLat, newLng]) => {
  if (map.value && newLat && newLng) {
    const coordinates = fromLonLat([newLng, newLat]);
    map.value.getView().setCenter(coordinates);
    updateMarker(coordinates);
  }
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
  