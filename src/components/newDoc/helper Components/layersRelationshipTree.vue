<template>
    <ul>
        <li>
            <button
                @click="goToThisChildMethod(firstNewDoc._id)"
                class="child"
                :class="
                    $route.params._id == firstNewDoc._id ? 'currentLayer' : ''
                "
            >
                {{ firstNewDoc.title || firstNewDoc._id }}
            </button>
            <button
                class="visibility"
                @click="changeVisibility(firstNewDoc._id)"
            >
                <i
                    class="far"
                    :class="
                        invisibleDocs.includes(firstNewDoc._id)
                            ? 'fa-eye-slash'
                            : 'fa-eye'
                    "
                ></i>
            </button>
            <Layers-tree
                v-if="firstNewDoc.childs_id.length"
                :father="firstNewDoc"
            />
        </li>
    </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LayersTree from "@/components/newDoc/helper Components/layersTree";

export default {
    name: "LayersRelationShips",
    components: { LayersTree },
    computed: {
        ...mapGetters(["DocChilds"]),
        firstNewDoc() {
            return this.$store.state.docs.newDocs[0];
        },
        invisibleDocs() {
            return this.$store.state.docs.DocProp.invisibleDocs || [];
        },
    },
    methods: {
        ...mapActions("docs", ["goToChild"]),
        changeVisibility(_id) {
            this.$store.commit("docs/CHANGE_VISIBILITY_doc", _id);
        },
        goToThisChildMethod(_id) {
            if (this.$route.params._id == _id) return;
            this.goToChild(_id);
            this.$emit("childClicked");
        },
    },
};
</script>

<style>
</style>