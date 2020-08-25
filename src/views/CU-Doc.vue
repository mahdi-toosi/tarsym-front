<template>
	<div class="newpoint">
		<header>
			<button class="btn btn-red ml1" @click="CLEAR_NEW_DOC()">
				منصرف شدم
				<i class="fas fa-times"></i>
			</button>
			<button class="btn btn-green" @click="Create_or_Update_Documents()">
				{{ $route.name == 'create doc' ? 'ثبت' : 'بروزرسانی' }}
				<i class="fas fa-save"></i>
			</button>
			<!-- back button -->
			<button class="btn btn-back" @click="goBackToParent()" v-if="DocProp.index !== 0 ">
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<div v-if="newDocs.length">
			<section class="shadow">
				<input class="title" type="text" placeholder="عنوان" v-model="newPointTitle" />
				<v-select
					:options="validCategories"
					:value="DocLayer.categories"
					@input="SET_CHOSEN_TAXONOMY( {$event , type: 1} )"
					label="name"
					placeholder="دسته بندی ..."
					multiple
					taggable
					push-tags
					class="tags categories"
					dir="rtl"
					v-if="DocLayer.root"
				>
					<template slot="no-options">هنوز دسته بندی ای به ثبت نرسیده ...</template>
				</v-select>
				<quill-editor v-model="newPointDescription" :options="quillEditorOptions" />
			</section>
			<section class="tag_date_section">
				<v-select
					:options="taxonomies.tags"
					:value="DocLayer.tags"
					@input="SET_CHOSEN_TAXONOMY( {$event , type: 2} )"
					label="name"
					placeholder="تگ ..."
					multiple
					taggable
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
					<span @click="tabContent = 'tools'" :class="tabContent == 'tools' ? 'activeTab' : ''">ابزار ها</span>
					<span @click="tabContent = 'layers'" :class="tabContent == 'layers' ? 'activeTab' : ''">لایه ها</span>
				</div>
				<div class="content">
					<div class="tools-content" v-show="tabContent == 'tools'">
						<ul class="tools">
							<li v-for="(tool, index) in DocLayer.tools" :key="index">
								<new-point :tool="tool" :index="index" v-if="tool.type == 'Point'" class="tool" />
								<new-polygon :tool="tool" :index="index" v-if="tool.type == 'Polygon'" class="tool" />
								<new-polyline :tool="tool" :index="index" v-if="tool.type == 'Polyline'" class="tool" />
								<new-text-box :tool="tool" :index="index" v-if="tool.type == 'Textbox'" class="tool" />
							</li>
						</ul>
						<gooey-menu />
					</div>
					<div class="layers-content" v-show="tabContent == 'layers'">
						<ul>
							<li v-for="(child, index) in DocChilds" :key="index">
								<button @click="goToChild( child._id )" class="child">{{ ( child.title || child._id ) }}</button>
								<button @click="Delete_this_Document( child._id )" class="delete_button">
									<i class="far fa-trash-alt"></i>
								</button>
							</li>
						</ul>
						<div class="addNewLayerBox">
							<v-select
								:options="searchBoxOptions"
								@search="onSearch"
								v-model="searchedDoc"
								:filterable="false"
								label="title"
								placeholder="جستجو ..."
								dir="rtl"
								class="seachBoxForLayer"
							>
								<template slot="no-options">داکیومنتی با این عنوان به ثبت نرسیده...</template>
								<template slot="option" slot-scope="option">
									<div class="seachBoxForLayerOption">
										<h4>{{ option.title }}</h4>
										<p>{{ option.excerpt }}</p>
									</div>
								</template>
							</v-select>
							<button @click="addChild()" class="btn btn-blue addNewLayer">+</button>
						</div>
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
// * components
import datePicker from "@/components/newDoc/datePicker";
import gooeyMenu from "@/components/newDoc/gooeyMenu";
import newPoint from "@/components/newDoc/newPoint";
import newPolygon from "@/components/newDoc/newPolygon";
import newPolyline from "@/components/newDoc/newPolyline";
import newTextBox from "@/components/newDoc/newTextBox";
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
			searchBoxOptions: [],
			searchedDoc: [],
			tabContent: "tools",
			quillEditorOptions: {
				modules: { toolbar: toolbarOptions },
				theme: "snow",
				placeholder: "توضیحات ...",
			},
			defaultColor: "#FF0000",
		};
	},
	methods: {
		...mapMutations(["CLEAR_NEW_DOC", "SET_CHOSEN_TAXONOMY"]),
		...mapActions([
			"Create_or_Update_Documents",
			"addNewDoc",
			"goBackToParent",
			"goToChild",
			"Delete_this_Document",
			"update_this_doc",
			"get_childs",
			"get_All_Taxanomies",
			"addExistingDoc",
		]),
		async addChild() {
			if (this.searchedDoc._id) {
				await this.addExistingDoc(this.searchedDoc._id);
			} else {
				await this.addNewDoc(false);
			}
			this.tabContent = "tools";
		},
		async onSearch(search, loading) {
			if (!search.trim()) return;
			loading(true);
			this.searchRequest(search, loading, this);
		},
		searchRequest: debounce(async (search, loading, vm) => {
			const url = `/search/${search}`,
				params = { params: { forLayers: true } };
			await vm.$axios
				.get(url, params)
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
			await searchedData.forEach((data) => {
				const newDocs = this.$store.state.newDocs;
				const alreadyThere = newDocs.filter(
					(doc) => doc._id == data._id
				);
				if (!alreadyThere.length) filteredData.push(data);
			});
			return filteredData;
		},
		lastAddedDocID() {
			const Docs = this.$store.state.newDocs;
			if (Docs.length > 0) {
				const lastDoc = Docs[Docs.length - 1];
				return lastDoc._id;
			}
			return false;
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
		...mapState(["newDocs", "DocProp", "taxonomies"]),
		...mapGetters(["DocLayer", "DocChilds", "validCategories"]),
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
	},
	async created() {
		const routeName = this.$route.name;
		const route_id = this.$route.params._id;
		const lastAddedDocID = this.lastAddedDocID();
		this.get_All_Taxanomies(false); //* withCache = false
		if (routeName == "create doc") {
			if (Number(route_id) !== lastAddedDocID) {
				await this.addNewDoc();
				return;
			}
		} else if (routeName == "update doc") {
			await this.update_this_doc(route_id);
		}
		await this.get_childs(this.DocLayer);
		// document.addEventListener("keyup", this.keyPressed);
	},
	mounted() {
		// const quillButtons = document.querySelectorAll(".ql-toolbar button");
		// quillButtons.forEach((element) => {
		// 	console.log(element);
		// 	element.setAttribute("tabindex", "-1");
		// });
	},
	components: {
		datePicker,
		quillEditor,
		gooeyMenu,
		newPoint,
		newPolygon,
		newPolyline,
		newTextBox,
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

<style scoped lang="stylus">
.tools {
	padding: 0px;
}

.addNewLayerBox {
	display: flex;

	.seachBoxForLayer {
		width: 70%;
		margin: auto;
	}
}
</style>
