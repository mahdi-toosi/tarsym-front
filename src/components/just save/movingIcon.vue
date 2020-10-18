<template>
    <div>
        <l-map :zoom="2" :center="initialLocation">
            <l-icon-default></l-icon-default>
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <l-moving-marker
                :lat-lng="location.latlng"
                :duration="movingMarkerDuration"
                :icon="icon"
                :keepAtCenter="false"
            >
                <l-popup :content="location.text"></l-popup>
            </l-moving-marker>
            <l-polyline
                :lat-lngs="polyline.latlngs"
                :color="polyline.color"
            ></l-polyline>
        </l-map>
        <button
            @click="movingIconControl('next')"
            :disabled="movingIconButtonIsDisable"
        >
            go to next
        </button>
        <button
            @click="movingIconControl('previous')"
            :disabled="movingIconButtonIsDisable"
        >
            go to previous
        </button>
    </div>
</template>

<script>
import L from "leaflet";
import {
    LMap,
    LTileLayer,
    LIconDefault,
    LPopup,
    LPolyline,
} from "vue2-leaflet";
import LMovingMarker from "vue2-leaflet-movingmarker";

export default {
    name: "movingMarkerComponent",
    components: {
        LMap,
        LTileLayer,
        LIconDefault,
        LPopup,
        LPolyline,
        LMovingMarker,
    },
    data() {
        let icon = L.icon({
            iconUrl:
                "https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
            iconSize: [21, 31],
            iconAnchor: [10.5, 31],
            popupAnchor: [4, -25],
        });
        return {
            location: {},
            curentItem: 0,
            locations: [
                {
                    latlng: [1, 1],
                    text: "item One",
                },
                {
                    latlng: [40, 20],
                    text: "item Two",
                },
                {
                    latlng: [20, 20],
                    text: "item Three",
                },
            ],
            movingIconButtonIsDisable: false,
            movingMarkerDuration: 500,
            polyline: {
                latlngs: [],
                color: "green",
            },
            icon,
            initialLocation: { lat: 5, lng: 5 },
        };
    },
    methods: {
        movingIconControl(k) {
            const Ls = this.locations;
            const index = Ls.indexOf(this.location);
            switch (k) {
                case "next":
                    if (index >= 0 && index < Ls.length - 1) {
                        this.location = Ls[index + 1];
                    }
                    break;
                case "previous":
                    if (index > 0) {
                        this.location = Ls[index - 1];
                    }
                    break;
            }
        },
    },
    mounted() {
        this.location = this.locations[0];
        this.locations.filter((l) => {
            this.polyline.latlngs.push(l.latlng);
        });
    },
};
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";
html,
body {
    height: 100%;
    margin: 0;
}
.vue2leaflet-map {
    width: 500px !important;
    height: 500px !important;
    margin: 0 auto;
}
button {
    margin: 10px;
}
</style>
