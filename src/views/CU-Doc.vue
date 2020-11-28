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
                {{ $route.name === "create doc" ? "ثبت" : "بروزرسانی" }}
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
                    @input="SET_Taxonomie_in_Doc({ $event, cats: true })"
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

                <QuillEditor
                    v-model="newPointDescription"
                    :options="quillEditorOptions"
                    ref="quillEditor"
                />

                <input
                    ref="quillimageInput"
                    style="display: none"
                    type="file"
                    accept="image/gif, image/jpeg, image/png"
                    @change="quillUploadImage"
                />
            </section>
            <section class="tag_date_section">
                <v-select
                    :options="taxonomies.tags"
                    :value="DocLayer.tags"
                    @input="SET_Taxonomie_in_Doc({ $event, cats: false })"
                    placeholder="تگ ..."
                    multiple
                    :taggable="35 <= user.role"
                    push-tags
                    class="tags"
                    dir="rtl"
                    v-if="DocLayer.root"
                />
                <date-picker class="datepicker" />
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
                            <Draggable
                                v-model="DocTools"
                                handle=".fa-grip-vertical"
                            >
                                <li
                                    v-for="(tool, index) in DocTools"
                                    :key="index"
                                >
                                    <i
                                        class="fas fa-grip-vertical"
                                        v-if="tool.isOn"
                                    ></i>
                                    <NewPoint
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Point'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    />
                                    <NewPolygon
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Polygon'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    />
                                    <NewPolyline
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Polyline'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    />
                                    <NewTextBox
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Textbox'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    />
                                    <NewHeatmap
                                        :tool="tool"
                                        :index="index"
                                        v-if="tool.type === 'Heatmap'"
                                        class="tool"
                                        :class="{ active: tool.isOn }"
                                    />
                                </li>
                            </Draggable>
                        </ul>
                        <GooeyMenu />
                    </div>
                    <div class="layers-content" v-show="tabContent == 'layers'">
                        <LayersRelationshipTree
                            @childClicked="tabContent = 'tools'"
                        />
                        <AddNewLayerBox @childAdded="tabContent = 'tools'" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
// * VUEX
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

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

// * Vue draggable
import Draggable from "vuedraggable";

import NewPoint from "@/components/newDoc/newPoint";
import NewPolygon from "@/components/newDoc/newPolygon";
import NewPolyline from "@/components/newDoc/newPolyline";
import NewTextBox from "@/components/newDoc/newTextBox";
import NewHeatmap from "@/components/newDoc/newHeatmap";
import datePicker from "@/components/newDoc/helper Components/datePicker";
import GooeyMenu from "@/components/newDoc/helper Components/gooeyMenu";
import AddNewLayerBox from "@/components/newDoc/helper Components/addNewLayerBox";
import LayersRelationshipTree from "@/components/newDoc/helper Components/layersRelationshipTree";

export default {
    name: "newDoc",
    data() {
        return {
            tabContent: "tools",
            // customModulesForEditor: [{ alias: "imageDrop", module: ImageDrop }],
            quillEditorOptions: {
                modules: {
                    toolbar: {
                        container: [
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
                        ],
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
        ...mapMutations([
            "CLEAR_NEW_DOC",
            "SET_Taxonomie_in_Doc",
            "DRAG_TOOL_UPDATE",
            "UPDATE_ON_TOOL",
        ]),
        ...mapActions([
            "Create_or_Update_Documents",
            "addNewDoc",
            "goBackToParent",
            "get_this_doc_for_update",
            "get_childs",
            "get_User_Taxonomies",
        ]),
        onUpdate: function (event) {
            console.log({ event });
        },
        insertImage() {
            // manipulate the DOM to do a click on hidden input
            this.$refs.quillimageInput.click();
        },
        async quillUploadImage(event) {
            // for simplicity I only upload the first image
            const file = event.target.files[0];
            if (file && file.size > 2e5) {
                this.$toasted.error("حجم عکس حداکثر 200kb میتواند باشد");
                return;
            }
            // create form data
            const fd = new FormData();
            // just add file instance to form data normally
            fd.append("docImage", file);
            // I use axios here, should be obvious enough
            console.log("fd => ", fd);
            const response = await this.$axios
                .post("/uploadDocImage", fd, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
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
            if (Docs.length) {
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
            this.taxonomies.tags = [...new Set(tags)];
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
        DocTools: {
            get() {
                return this.DocLayer.tools;
            },
            set(value) {
                this.DRAG_TOOL_UPDATE(value);
                this.UPDATE_ON_TOOL();
            },
        },
        newPointTitle: {
            get() {
                return this.DocLayer.title;
            },
            set(val) {
                this.DocLayer.title = val;
            },
        },
        newPointDescription: {
            get() {
                return this.DocLayer.description;
            },
            set(val) {
                this.DocLayer.description = val;
            },
        },
        quillInstance() {
            return this.$refs.quillEditor.quill;
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
        this.getAndSetTaxonomies();

        const routeName = this.$route.name;
        const route_id = this.$route.params._id;
        if (routeName === "create doc") {
            const lastAddedDocID = this.lastAddedDocID();
            if (Number(route_id) !== lastAddedDocID) await this.addNewDoc();
            return;
        } else if (routeName === "update doc")
            await this.get_this_doc_for_update(route_id);
        // document.addEventListener("keyup", this.keyPressed);
    },
    mounted() {
        // this.get_childs();
        // const quillButtons = document.querySelectorAll(".ql-toolbar button");
        // quillButtons.forEach((element) => {
        // 	console.log(element);
        // 	element.setAttribute("tabindex", "-1");
        // });
    },
    components: {
        vSelect,
        datePicker,
        QuillEditor: quillEditor,
        Draggable,
        GooeyMenu,
        NewPoint,
        NewPolygon,
        NewPolyline,
        NewTextBox,
        NewHeatmap,
        AddNewLayerBox,
        LayersRelationshipTree,
    },
};
</script>