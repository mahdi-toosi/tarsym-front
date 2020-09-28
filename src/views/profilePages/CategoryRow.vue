<template>
    <div class="tree">
        <label :for="Cat._id">
            <i class="fas fa-angle-left" v-if="Cat.children.length"></i>
            {{ Cat.name }}
        </label>
        <input
            type="checkbox"
            :id="Cat._id"
            v-if="Cat.children.length"
            hidden
        />
        <div class="item">
            <span class="name">{{ Cat.documents.length }} سند</span>
            <div class="options" v-if="Cat.name !== uncategorized">
                <span @click="SET_TO_EDIT_STAGE({ father, update: false })">
                    <i class="fas fa-plus"></i>
                </span>
                <span @click="SET_TO_EDIT_STAGE({ Cat, father, update: true })">
                    <i class="fas fa-edit"></i>
                </span>
                <span
                    @click="pasteCat({ Cat, father })"
                    v-if="rootData.movecat._id"
                >
                    <i class="fas fa-paste"></i>
                </span>
                <span
                    @click="cutCat({ Cat, father })"
                    v-if="!rootData.movecat._id"
                >
                    <i class="fas fa-cut"></i>
                </span>
            </div>
        </div>
        <div v-if="Cat.children.length" class="itemGroup">
            <Category-row
                v-for="Cat in Cat.children"
                :key="Cat._id"
                :Cat="Cat"
                :father="Cat"
            />
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
    props: ["Cat", "father"],
    name: "CategoryRow",
    data() {
        return {
            uncategorized: "بدون دسته بندی",
        };
    },
    methods: {
        ...mapMutations(["SET_TO_EDIT_STAGE", "pasteCat", "cutCat"]),
    },
    computed: {
        rootData() {
            return this.$store.state.profilePage.categoriesPage;
        },
    },
};
</script>

<style>
</style>