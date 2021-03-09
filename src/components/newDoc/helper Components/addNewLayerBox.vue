<template>
    <div class="addNewLayerBox">
        <VSelect
            :options="searchBoxOptions"
            @search="onSearch"
            v-model="searchedDoc"
            :filterable="false"
            label="title"
            placeholder="جستجو ..."
            dir="rtl"
            class="seachBoxForLayer"
        >
            <template slot="no-options"
                >داکیومنتی با این عنوان به ثبت نرسیده...</template
            >
            <template slot="option" slot-scope="option">
                <div class="seachBoxForLayerOption">
                    <h4>{{ option.title }}</h4>
                    <p>{{ option.excerpt }}</p>
                </div>
            </template>
        </VSelect>
        <button @click="addChild()" class="btn btn-blue addNewLayer">
            <i class="fa fa-plus"></i>
        </button>
    </div>
</template>

<script>
import VSelect from "vue-select";

export default {
    data() {
        return {
            searchBoxOptions: [],
            searchedDoc: [],
        };
    },
    methods: {
        searchRequest: debounce(async (search, loading, vm) => {
            const url = `/searchInDocs`,
                options = { params: { text: search, forLayers: true } };
            await vm.$axios
                .get(url, options)
                .then(async ({ data }) => {
                    const filteredData = await vm.filterSearchedData(data.data);
                    vm.searchBoxOptions = filteredData;
                    loading(false);
                })
                .catch((error) => {
                    vm.$store.dispatch("handleAxiosError", error);
                    loading(false);
                });
        }, 1500),
        async filterSearchedData(searchedData) {
            let filteredData = [];
            if (!searchedData.length) return filteredData;
            await searchedData.forEach((data) => {
                const newDocs = this.$store.state.docs.newDocs;
                const alreadyThere = newDocs.filter(
                    (doc) => doc._id == data._id
                );
                if (!alreadyThere.length) filteredData.push(data);
            });
            return filteredData;
        },
        async addChild() {
            if (this.searchedDoc._id) {
                await this.$store.dispatch(
                    "docs/addExistingDoc",
                    this.searchedDoc._id
                );
            } else await this.$store.dispatch("docs/addNewDoc", false);
            this.$emit("childAdded");
            this.searchedDoc = [];
        },
        async onSearch(search, loading) {
            if (!search.trim()) return;
            loading(true);
            this.searchRequest(search, loading, this);
        },
    },
    components: { VSelect },
};
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
</script>