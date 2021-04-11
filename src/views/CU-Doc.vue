<template>
    <div class="newpoint">
        <header>
            <button
                class="btn btn-red ml1"
                @click="$router.push(`/profile/${user.username}`)"
            >
                منصرف شدم
                <i class="mdi mdi-close"></i>
            </button>
            <button class="btn btn-green" @click="Create_or_Update_Documents()">
                {{ $route.name === "create doc" ? "ثبت" : "بروزرسانی" }}
                <i class="mdi mdi-check"></i>
            </button>
            <!-- back button -->
            <button
                class="btn btn-back"
                @click="goBackToParent()"
                v-if="DocProp.index !== 0"
            >
                <i class="mdi mdi-arrow-left"></i>
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
                    @input="ADD_TAXONOMY({ $event, isCategory: true })"
                    placeholder="دسته بندی ..."
                    multiple
                    :taggable="user.role >= 35"
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
                    @input="ADD_TAXONOMY({ $event, isCategory: false })"
                    placeholder="تگ ..."
                    multiple
                    :taggable="user.role >= 35"
                    push-tags
                    class="tags"
                    dir="rtl"
                    v-if="DocLayer.root"
                />
                <DatePicker
                    v-model="date"
                    format="YYYY-MM-DD"
                    displayFormat="jYYYY/jMM/jDD"
                    color="#00acc1"
                />
            </section>

            <Options-section />
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

// *  vue select styles
import "vue-select/dist/vue-select.css";

export default {
    name: "newDoc",
    metaInfo() {
        return {
            title: `ترسیم - ادیت داکیومنت`,
            meta: [{ name: "robots", content: "noindex, nofollow" }],
        };
    },
    data() {
        return {
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
            taxonomies: {
                categories: [
                    ["تاریخی", "دفاع مقدس"],
                    ["تاریخی", "انقلاب اسلامی"],
                    ["خبری", "نظامی"],
                    ["خبری", "سیاست خارجی"],
                    ["خبری", "محیط زیست"],
                    ["خبری", "ورزشی"],
                    ["آبادانی", "عمرانی"],
                    ["آبادانی", "کارآفرینی"],
                    ["آبادانی", "خیریه"],
                ],
                tags: [],
            },
        };
    },
    methods: {
        ...mapMutations("docs", [
            "ADD_TAXONOMY",
            "SET_DATE",
            "SET_TITLE",
            "SET_DESCRIPTION",
            "SET_IMG",
            "UPDATE_DOC_INDEX",
        ]),
        ...mapActions("docs", [
            "Create_or_Update_Documents",
            "addNewDoc",
            "goBackToParent",
            "get_this_doc_for_update",
            "get_childs",
            "quite_creating",
            "flyToThisDoc",
        ]),
        insertImage() {
            if (this.user.role > 35 && this.user.role !== 37)
                this.$refs.quillimageInput.click();
            else
                this.$toasted.error(
                    "برای آپلود عکس باید به اکانت نقره ای ارتقاء پیدا کنید ..."
                );
        },
        async quillUploadImage(event) {
            // for simplicity I only upload the first image
            const image = event.target.files[0];
            if (image && image.size > 2e5) {
                this.$toasted.error("حجم عکس حداکثر 200kb میتواند باشد");
                return;
            }
            event.target.value = "";
            // create form data
            const formData = new FormData();
            // just add file instance to form data normally
            formData.append("docImage", image);
            // I use axios here, should be obvious enough
            const response = await this.$axios
                .post("/uploadDocImage", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    this.SET_IMG(res.data);
                    return res.data;
                })
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
            const Docs = this.newDocs;
            if (Docs.length) {
                const lastDoc = Docs[Docs.length - 1];
                return lastDoc._id;
            }
            return false;
        },
        async getAndSetTaxonomies() {
            await this.$axios
                .get("/documents/buu/taxonomies")
                .then((res) => {
                    this.taxonomies.tags = res.data.tags;
                    this.taxonomies.categories = [
                        ...this.taxonomies.categories,
                        ...res.data.categories,
                    ];
                })
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        init() {
            if (this.newDocs.length) this.UPDATE_DOC_INDEX();
            // * show document items if invisible
            const _id = this.$route.params._id;
            const invisibleDocs = this.DocProp.invisibleDocs || [];
            const indexOfDoc = invisibleDocs.indexOf(_id);
            if (indexOfDoc > -1) invisibleDocs.splice(indexOfDoc, 1);

            // * flyToThisDoc
            setTimeout(() => {
                this.$store.dispatch("change_map_layers");
                this.flyToThisDoc();
            }, 300);
        },
    },
    watch: {
        $route: "init",
    },
    computed: {
        ...mapState({
            newDocs: (state) => state.docs.newDocs,
            DocProp: (state) => state.docs.DocProp,
            user: (state) => state.user,
        }),
        ...mapGetters(["DocLayer"]),
        date: {
            get() {
                return this.DocLayer.date;
            },
            set(val) {
                this.SET_DATE(val);
            },
        },
        newPointTitle: {
            get() {
                return this.DocLayer.title;
            },
            set(val) {
                this.SET_TITLE(val);
            },
        },
        newPointDescription: {
            get() {
                return this.DocLayer.description;
            },
            set(val) {
                this.SET_DESCRIPTION(val);
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
    beforeRouteEnter(to, from, next) {
        next(async (vm) => {
            vm.init();
        });
    },
    async beforeDestroy() {
        this.quite_creating();
    },
    async created() {
        const routeName = this.$route.name;
        const route_id = this.$route.params._id;
        if (routeName === "create doc") {
            const lastAddedDocID = this.lastAddedDocID();
            if (Number(route_id) !== lastAddedDocID) await this.addNewDoc();
        } else if (routeName === "update doc") {
            await this.get_this_doc_for_update(route_id);
        }

        // document.addEventListener("keyup", this.keyPressed);
        this.getAndSetTaxonomies();
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
        vSelect: () => import("vue-select"),
        DatePicker: () => import("vue-persian-datetime-picker"),
        QuillEditor: quillEditor,
        OptionsSection: () => import("@/components/newDoc/Options-section"),
    },
};
</script>
<style lang="stylus">
@import '../assets/styles/newpoint.styl';
</style>