<template>
    <div
        class="layerPicker"
        ref="TileProviders"
        :class="displayTileProviders ? 'showTileProviders' : ''"
    >
        <div class="bugFix" @click.self="toggleTileProviders()"></div>
        <div>
            <i class="fas fa-layer-group"></i>
        </div>
        <div
            class="radiobox"
            v-for="(tileProvider, i) in map.tileProviders"
            :key="tileProvider.name"
            dir="rtl"
            v-show="tileProvider"
        >
            <input
                type="radio"
                name="picktile"
                :id="tileProvider.name"
                :value="i"
                v-model="tileLayerIndex"
                @click.self="toggleTileProviders()"
            />
            <label :for="tileProvider.name" v-text="tileProvider.name"></label>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
    data() {
        return {
            displayTileProviders: false,
        };
    },
    computed: {
        ...mapState(["map"]),
        tileLayerIndex: {
            get() {
                return this.map.layerIndex;
            },
            set(val) {
                this.SET_THIS_LAYER(val);
                this.UPDATE_LAYER(val);
            },
        },
    },
    methods: {
        ...mapMutations("docs", ["UPDATE_LAYER"]),
        ...mapMutations("map", ["SET_THIS_LAYER"]),
        showTileProviders() {
            document.addEventListener("click", this.TileProvidersClickHandler);
            this.displayTileProviders = true;
        },
        hideTileProviders() {
            document.removeEventListener(
                "click",
                this.TileProvidersClickHandler
            );
            this.displayTileProviders = false;
        },
        toggleTileProviders() {
            this.displayTileProviders
                ? this.hideTileProviders()
                : this.showTileProviders();
        },
        TileProvidersClickHandler(e) {
            var el = this.$refs.TileProviders,
                target = e.target;
            if (!el || (el !== target && !el.contains(target))) {
                this.hideTileProviders();
            }
        },
    },
};
</script>

<style>
</style>