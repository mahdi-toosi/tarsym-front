<template>
    <div class="newpoint">
        <header>
            <button
                class="btn btn-red ml1"
                @click="
                    CLEAR_NEW_DOC(), $router.push(`/profile/${user.username}`)
                "
            >
                منصرف شدم
                <i class="fas fa-times"></i>
            </button>
            <button class="btn btn-green" @click="Create_or_Update_Documents()">
                {{ $route.name == "create doc" ? "ثبت" : "بروزرسانی" }}
                <i class="fas fa-save"></i>
            </button>
            <!-- back button -->
            <button
                class="btn btn-back"
                @click="goBackToParent()"
                v-if="DocProp.index !== 0"
            >
                <i class="fas fa-arrow-left"></i>
            </button>
        </header>
        <div v-if="newDocs.length">
            <section class="shadow">
                <input
                    class="title"
                    type="text"
                    placeholder="عنوان"
                    v-model="newPointTitle"
                />
                <v-select
                    :options="validCats"
                    :value="DocLayer.categories"
                    @input="SET_Taxonomie_in_Doc({ $event, cat: true })"
                    placeholder="دسته بندی ..."
                    multiple
                    :taggable="35 <= user.role"
                    push-tags
                    class="tags categories"
                    dir="rtl"
                    v-if="DocLayer.root"
                >
                    <template slot="no-options">
                        گزینه ای برای پیشنهاد نیست، دسته بندی جدیدی بسازید...
                    </template>
                </v-select>
                <quill-editor
                    v-model="newPointDescription"
                    :options="quillEditorOptions"
                    ref="quillEditor"
                />
                <input
                    ref="quillimageInput"
                    style="display: none"
                    type="file"
                    accept="image/gif, image/jpeg, image/png"
                    @change="_doImageUpload"
                />
            </section>
            <section class="tag_date_section">
                <v-select
                    :options="validTags"
                    :value="DocLayer.tags"
                    @input="SET_Taxonomie_in_Doc({ $event, cat: false })"
                    placeholder="تگ ..."
                    multiple
                    :taggable="35 <= user.role"
                    push-tags
                    class="tags"
                    dir="rtl"
                    v-if="DocLayer.root"
                />
                <date-picker class="datepicker" :docLayer="DocProp.index" />
            </section>
            <section class="tools shadow">
                <br />
                <div class="tabs">
                    <span
                        @click="tabContent = 'tools'"
                        :class="tabContent == 'tools' ? 'activeTab' : ''"
                        >ابزار ها</span
                    >
                    <span
                        @click="tabContent = 'layers'"
                        :class="tabContent == 'layers' ? 'activeTab' : ''"
                        >لایه ها</span
                    >
                </div>
                <div class="content">
                    <div class="tools-content" v-show="tabContent == 'tools'">
                        <ul class="tools">
                            <li
                                v-for="(tool, index) in DocLayer.tools"
                                :key="index"
                            >
                                <new-point
                                    :tool="tool"
                                    :index="index"
                                    v-if="tool.type == 'Point'"
                                    class="tool"
                                />
                                <new-polygon
                                    :tool="tool"
                                    :index="index"
                                    v-if="tool.type == 'Polygon'"
                                    class="tool"
                                />
                                <new-polyline
                                    :tool="tool"
                                    :index="index"
                                    v-if="tool.type == 'Polyline'"
                                    class="tool"
                                />
                                <new-text-box
                                    :tool="tool"
                                    :index="index"
                                    v-if="tool.type == 'Textbox'"
                                    class="tool"
                                />
                            </li>
                        </ul>
                        <gooey-menu />
                    </div>
                    <div class="layers-content" v-show="tabContent == 'layers'">
                        <layers-relationship-tree
                            @childClicked="tabContent = 'tools'"
                        />
                        <add-new-layer-box @childAdded="tabContent = 'tools'" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
// * quill Editor
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";
// TODO => fix the quill-image-drop errors

// *  vue slider styles
import "vue-slider-component/theme/antd.css";

// * components
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import newPoint from "@/components/newDoc/newPoint";
import newPolygon from "@/components/newDoc/newPolygon";
import newPolyline from "@/components/newDoc/newPolyline";
import newTextBox from "@/components/newDoc/newTextBox";
import datePicker from "@/components/newDoc/helper Components/datePicker";
import gooeyMenu from "@/components/newDoc/helper Components/gooeyMenu";
import addNewLayerBox from "@/components/newDoc/helper Components/addNewLayerBox";
import layersRelationshipTree from "@/components/newDoc/helper Components/layersRelationshipTree";
// * VUEX
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
    name: "newDoc",
    data() {
        const toolbarOptions = [
            ["blockquote", "italic", "underline", "bold"], // toggled buttons
            [
                "image",
                { background: [] },
                { color: [] },
                { align: [] },
                { direction: "rtl" },
            ],
            [{ header: [2, 3, false] }],
            ["clean"],
        ];
        return {
            tabContent: "tools",
            // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }],
            quillEditorOptions: {
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            image: this.insertImage,
                        },
                    },
                },
                theme: "snow",
                placeholder: "توضیحات ...",
            },
            defaultColor: "#FF0000",
            taxonomies: { categories: [], tags: [] },
        };
    },
    methods: {
        ...mapMutations(["CLEAR_NEW_DOC", "SET_Taxonomie_in_Doc"]),
        ...mapActions([
            "Create_or_Update_Documents",
            "addNewDoc",
            "goBackToParent",
            "update_this_doc",
            "get_childs",
            "get_User_Taxonomies",
        ]),
        insertImage() {
            // manipulate the DOM to do a click on hidden input
            this.$refs.quillimageInput.click();
        },
        async _doImageUpload(event) {
            // for simplicity I only upload the first image
            const file = event.target.files[0];
            // 1e+6 == 1MB
            if (file && file.size > 1e6) {
                this.$toasted.error("حجم عکس حداکثر 1mb میتوانید باشد");
                return;
            }
            // create form data
            const fd = new FormData();
            // just add file instance to form data normally
            fd.append("image", file);
            // I use axios here, should be obvious enough
            console.log("fd => ", fd);
            const url = "/upload-images";
            const response = await this.$axios
                .post(url, fd)
                .then((res) => res.data)
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                    return false;
                });
            if (!response) {
                let msg =
                    "آپلود عکس با مشکل روبرو شده. لطفا دوباره امتحان کنید ...";
                this.$toasted.error(msg);
                return;
            }
            console.log("response => ", response);
            // clear input value to make selecting the same image work
            event.target.value = "";
            // get current index of the cursor
            const currentIndex = this.quillInstance.selection.lastRange.index;
            // insert uploaded image url to 'image' embed (quill does this for you)
            // the embed looks like this: <img src="{url}" />
            // TODO => delete isProduction if is not necessary
            const isProduction = process.env.NODE_ENV === "production";
            this.quillInstance.insertEmbed(
                currentIndex,
                "image",
                isProduction
                    ? response.url
                    : process.env.VUE_APP_DOMAIN + response.url
            );
            // set cursor position to after the image
            this.quillInstance.setSelection(currentIndex + 1, 0);
        },
        lastAddedDocID() {
            const Docs = this.$store.state.newDocs;
            if (Docs.length > 0) {
                const lastDoc = Docs[Docs.length - 1];
                return lastDoc._id;
            }
            return false;
        },
        async getAndSetTaxonomies() {
            const tags = [],
                cats = [];
            const taxs = await this.get_User_Taxonomies();
            taxs.forEach((el) => {
                el.tags.forEach((tag) => tags.push(tag));
                cats.push(el.categories);
            });
            this.taxonomies.tags = tags;
            this.taxonomies.categories = cats;
        },
        // keyPressed(e) {
        // 	const OnTool = this.DocProp.OnTool;
        // 	if (e.keyCode === 27 && OnTool.condition) {
        // 		this.toolSwitch(OnTool.index);
        // 		return;
        // 	} else return;
        // },
    },
    computed: {
        ...mapState(["newDocs", "DocProp", "user"]),
        ...mapGetters(["DocLayer"]),
        newPointTitle: {
            get() {
                return this.DocLayer.title;
            },
            set(val) {
                return (this.DocLayer.title = val);
            },
        },
        newPointDescription: {
            get() {
                return this.DocLayer.description;
            },
            set(val) {
                return (this.DocLayer.description = val);
            },
        },
        quillInstance() {
            return this.$refs.quillEditor.quill;
        },
        validTags() {
            return [...new Set(this.taxonomies.tags)];
        },
        validCats() {
            const docCats = this.DocLayer.categories;
            const lastCat = docCats[docCats.length - 1];
            const validCats = [];
            this.taxonomies.categories.forEach((cat) => {
                if (docCats.length < 1) return validCats.push(cat[0]);

                if (
                    cat[docCats.length - 1] === lastCat &&
                    cat[docCats.length]
                ) {
                    validCats.push(cat[docCats.length]);
                }
            });
            return [...new Set(validCats)];
        },
    },
    async created() {
        const routeName = this.$route.name;
        const route_id = this.$route.params._id;
        this.getAndSetTaxonomies();
        const lastAddedDocID = this.lastAddedDocID();
        if (routeName == "create doc") {
            if (Number(route_id) !== lastAddedDocID) await this.addNewDoc();
            return;
        } else if (routeName == "update doc")
            await this.update_this_doc(route_id);
        // document.addEventListener("keyup", this.keyPressed);
    },
    mounted() {
        this.get_childs();
        // const quillButtons = document.querySelectorAll(".ql-toolbar button");
        // quillButtons.forEach((element) => {
        // 	console.log(element);
        // 	element.setAttribute("tabindex", "-1");
        // });
    },
    components: {
        vSelect,
        datePicker,
        quillEditor,
        gooeyMenu,
        newPoint,
        newPolygon,
        newPolyline,
        newTextBox,
        addNewLayerBox,
        layersRelationshipTree,
    },
};
</script>