<template>
    <ul>
        <li v-for="(child, index) in DocChilds" :key="index">
            <button
                @click="goToThisChildMethod(child._id)"
                class="child"
                :class="$route.params._id == child._id ? 'currentLayer' : ''"
            >
                {{ child.title || child._id }}
            </button>
            <button class="visibility" @click="changeVisibility(child._id)">
                <i
                    class="far"
                    :class="
                        invisibleDocs.includes(child._id)
                            ? 'fa-eye-slash'
                            : 'fa-eye'
                    "
                ></i>
            </button>
            <button @click="delete_this_child(child)" class="delete_button">
                <i class="far fa-trash-alt"></i>
            </button>
            <Layer-childs v-if="child.childs_id.length" :father="child" />
        </li>
    </ul>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "LayerChilds",
    props: ["father"],
    computed: {
        DocChilds() {
            return this.$store.getters.DocChilds(this.father);
        },
        invisibleDocs() {
            return this.$store.state.docs.DocProp.invisibleDocs || [];
        },
    },
    methods: {
        ...mapActions("docs", ["goToChild", "Delete_this_Document"]),
        changeVisibility(_id) {
            this.$store.commit("docs/CHANGE_VISIBILITY_doc", _id);
        },
        goToThisChildMethod(_id) {
            if (this.$route.params._id == _id) return;
            this.goToChild(_id);
            this.$emit("childClicked");
        },
        async delete_this_child(child) {
            await this.Delete_this_Document({ doc: child, root: false });
        },
    },
};
</script>

<style>
</style>