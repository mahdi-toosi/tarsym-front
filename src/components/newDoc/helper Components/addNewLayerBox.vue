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
        <button @click="addChild()" class="btn btn-blue addNewLayer">+</button>
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
                .then(async (res) => {
                    const filteredData = await vm.filterSearchedData(res.data);
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
                const newDocs = this.$store.state.newDocs;
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
                    "addExistingDoc",
                    this.searchedDoc._id
                );
            } else await this.$store.dispatch("addNewDoc", false);
            this.$emit("childAdded");
            this.searchedDoc = [];
        },
        async onSearch(search, loading) {
            if (!search.trim()) return;
            loading(true);
            this.searchRequest(search, loading, this);
        },
    },
    components: {
        VSelect,
    },
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

<style lang="stylus">
.addNewLayerBox {
    display: flex;
}

.v-select[dir=rtl] {
    .vs__actions {
        padding: 4px 6px 0 3px !important;
    }
}

.seachBoxForLayer {
    width: 70%;
    margin: auto;

    .vs__dropdown-toggle {
        border: 1px solid rgba(60, 60, 60, 0.26) !important;
        border-radius: 4px !important;
    }

    .vs__dropdown-menu {
        top: unset !important;
        bottom: 35px;
        border-radius: 4px 4px 0 0;
        border-top-style: solid;
        border-bottom-style: none;
        box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.15);

        li {
            overflow: hidden;
        }

        .seachBoxForLayerOption {
            width: 100%;
            border-right: 2px solid #d9d9d9;
            padding-right: 5px;
            margin: 0px !important;

            h4 {
                margin: 0px;
            }

            p {
                margin: 0px;
            }
        }
    }
}

.addNewLayer {
    border-radius: 999px;
    margin: 20px auto 20px;
    display: block;
    font-size: 40px;
    width: 40px;
    height: 40px;
    padding: 0px;
}
</style>