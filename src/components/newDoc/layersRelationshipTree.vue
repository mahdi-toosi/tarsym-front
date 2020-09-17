<template>
    <ul>
        <li>
            <button
                @click=" goToThisChildMethod(firstNewDoc._id) "
                class="child"
                :class="$route.params._id == firstNewDoc._id ? 'currentLayer' : '' "
            >{{ ( firstNewDoc.title || firstNewDoc._id ) }}</button>
            <button @click="delete_this_child( firstNewDoc._id )" class="delete_button">
                <i class="far fa-trash-alt"></i>
            </button>
            <ul v-if="firstNewDoc.childs_id.length">
                <li v-for="(child, index) in DocChilds( firstNewDoc )" :key="index">
                    <button
                        @click=" goToThisChildMethod( child._id ) "
                        class="child"
                        :class="$route.params._id == child._id ? 'currentLayer' : '' "
                    >{{ ( child.title || child._id ) }}</button>
                    <button @click="delete_this_child( child._id )" class="delete_button">
                        <i class="far fa-trash-alt"></i>
                    </button>
                    <ul v-if="child.childs_id.length">
                        <li v-for="(child, index) in DocChilds(child)" :key="index">
                            <button
                                @click=" goToThisChildMethod( child._id ) "
                                class="child"
                                :class="$route.params._id == child._id ? 'currentLayer' : '' "
                            >{{ ( child.title || child._id ) }}</button>
                            <button @click="delete_this_child( child._id )" class="delete_button">
                                <i class="far fa-trash-alt"></i>
                            </button>
                            <ul v-if="child.childs_id.length">
                                <li v-for="(child, index) in DocChilds(child)" :key="index">
                                    <button
                                        @click=" goToThisChildMethod( child._id ) "
                                        class="child"
                                        :class="$route.params._id == child._id ? 'currentLayer' : '' "
                                    >{{ ( child.title || child._id ) }}</button>
                                    <button
                                        @click="delete_this_child( child._id )"
                                        class="delete_button"
                                    >
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                    <ul v-if="child.childs_id.length">
                                        <li v-for="(child, index) in DocChilds(child)" :key="index">
                                            <button
                                                @click=" goToThisChildMethod( child._id ) "
                                                class="child"
                                                :class="$route.params._id == child._id ? 'currentLayer' : '' "
                                            >{{ ( child.title || child._id ) }}</button>
                                            <button
                                                @click="delete_this_child( child._id )"
                                                class="delete_button"
                                            >
                                                <i class="far fa-trash-alt"></i>
                                            </button>
                                            <ul v-if="child.childs_id.length">
                                                <li
                                                    v-for="(child, index) in DocChilds(child)"
                                                    :key="index"
                                                >
                                                    <button
                                                        @click=" goToThisChildMethod( child._id ) "
                                                        class="child"
                                                        :class="$route.params._id == child._id ? 'currentLayer' : '' "
                                                    >{{ ( child.title || child._id ) }}</button>
                                                    <button
                                                        @click="delete_this_child( child._id )"
                                                        class="delete_button"
                                                    >
                                                        <i class="far fa-trash-alt"></i>
                                                    </button>
                                                    <ul v-if="child.childs_id.length">
                                                        <li
                                                            v-for="(child, index) in DocChilds(child)"
                                                            :key="index"
                                                        >
                                                            <button
                                                                @click=" goToThisChildMethod( child._id ) "
                                                                class="child"
                                                                :class="$route.params._id == child._id ? 'currentLayer' : '' "
                                                            >{{ ( child.title || child._id ) }}</button>
                                                            <button
                                                                @click="delete_this_child( child._id )"
                                                                class="delete_button"
                                                            >
                                                                <i class="far fa-trash-alt"></i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["DocChilds"]),
        firstNewDoc() {
            return this.$store.state.newDocs[0];
        },
    },
    methods: {
        ...mapActions(["goToChild", "Delete_this_Document"]),
        goToThisChildMethod(_id) {
            if (this.$route.params._id == _id) return;
            this.goToChild(_id);
            this.$emit("childClicked");
        },
        async delete_this_child(child_id) {
            await this.Delete_this_Document(child_id);
        },
    },
};
</script>

<style>
</style>