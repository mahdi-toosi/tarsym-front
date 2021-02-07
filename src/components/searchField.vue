<template>
    <form class="searchbar shadow" @submit.prevent="fetchSearchResult()">
        <div class="searchInput">
            <button style="font-size: 22px" type="submit">
                <i class="fas fa-search" />
            </button>
            <input
                type="text"
                placeholder="جستجو ..."
                class="searchBox"
                v-model.lazy="search"
                v-debounce="delay"
                :style="{
                    borderBottom: showOptions ? '1px solid silver' : 'none',
                }"
            />
            <!-- <button style="font-size: 25px" @click="showOptions = !showOptions">
                <i class="fas fa-sliders-h"></i>
            </button> -->
        </div>
        <div class="options" v-show="showOptions">
            <button @click="$store.commit('CHANGE_SEARCH_POLYGON_SITUATION')">
                select polygon
            </button>
        </div>
    </form>
</template>

<script>
import debounce from "v-debounce";

export default {
    name: "searchComponent",
    directives: { debounce },

    data() {
        return {
            search: "",
            delay: 500,
            showOptions: false,
        };
    },
    methods: {
        fetchSearchResult() {
            const query = {};
            const searchedText = this.search.trim();
            if (searchedText.length < 4) {
                //  searchedText.length > 0 &&
                this.$toasted.info(
                    "کلمه جستجو شده حداقال 4 کاراکتر باید داشته باشد ..."
                );
                return;
            }
            query.text = searchedText;

            const polygonCoordinates = this.$store.state.searchPolygon
                .coordinates;
            if (polygonCoordinates.length > 2) {
                query.area = [];
                polygonCoordinates.forEach((coordinate) => {
                    query.area.push(coordinate.lat);
                    query.area.push(coordinate.lng);
                });
            }
            this.$router.push({ path: "/search", query });
        },
    },
    computed: {
        searchPolygon() {
            return this.$store.state.searchPolygon;
        },
    },
};
</script>

<style lang="stylus">
.searchbar {
    padding: 9px 15px;
    background: white;
    border-radius: 5px;

    .searchInput {
        width: 100%;
        display: flex;
        align-items: center;

        button {
            color: #8d96ac;
            height: 27px;
            cursor: pointer;
        }

        input {
            width: 86%;
            line-height: 2;
            border: 0;
            padding: 0px 10px 4px;
            // width: 180px;
        }
    }

    .options {
        margin-top: 10px;
    }
}
</style>