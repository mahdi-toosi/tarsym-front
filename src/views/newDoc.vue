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
			<button class="btn btn-back" @click="goBack()" v-if="newDocProp.index !== 0">
				<i class="fas fa-arrow-left"></i>
			</button>
		</header>
		<div v-if="newDocs.length > 0">
			<section class="shadow">
				<input class="title" type="text" placeholder="عنوان" v-model="newPointTitle" />
				<quill-editor v-model="newPointDescription" :options="quillEditorOptions" />
			</section>
			<section class="tag_date_section">
				<v-select
					:options="allTags"
					:value="chosenTags"
					@input="SET_CHOSEN_TAG"
					label="name"
					placeholder="تگ ..."
					multiple
					taggable
					push-tags
					class="tags"
					v-if="newDocLayer.tags"
				/>
				<date-picker class="datepicker" :docLayer="newDocProp.index" />
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
							<li v-for="(tool, index) in newDocLayer.tools" :key="index">
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
							<li v-for="(child, index) in newDocChilds" :key="index">
								<button
									@click="goToChild(child._id ? child._id : child.id)"
									class="child"
								>{{ child.title ? child.title : child.id }}</button>
								<button
									@click="Delete_this_Document(child._id ? child._id : child.id)"
									class="delete_button"
								>
									<i class="far fa-trash-alt"></i>
								</button>
							</li>
						</ul>
						<button @click="addNewDoc(false) , tabContent = 'tools'" class="btn btn-blue addNewLayer">+</button>
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
			mahdi: false,
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
		...mapMutations(["CLEAR_NEW_DOC", "SET_CHOSEN_TAG"]),
		...mapActions([
			"Create_or_Update_Documents",
			"addNewDoc",
			"goBack",
			"goToChild",
			"Delete_this_Document",
			"update_this_doc",
			"get_childs",
			"get_All_Tag",
		]),

		// keyPressed(e) {
		// 	const OnTool = this.newDocProp.OnTool;
		// 	if (e.keyCode === 27 && OnTool.condition) {
		// 		this.toolSwitch(OnTool.index);
		// 		return;
		// 	} else return;
		// },
	},
	computed: {
		...mapState(["newDocs", "newDocProp", "allTags"]),
		...mapGetters([
			"newDocLayer",
			"lastAddedDocID",
			"newDocChilds",
			"chosenTags",
		]),
		newPointTitle: {
			get() {
				return this.newDocLayer.title;
			},
			set(val) {
				return (this.newDocLayer.title = val);
			},
		},
		newPointDescription: {
			get() {
				return this.newDocLayer.description;
			},
			set(val) {
				return (this.newDocLayer.description = val);
			},
		},
	},
	async created() {
		const routeName = this.$route.name;
		const routeID = this.$route.params.id;
		const lastAddedDocID = this.lastAddedDocID;
		if (routeName == "create doc") {
			if (Number(routeID) !== lastAddedDocID)
				return await this.addNewDoc();
		} else if (routeName == "update doc") {
			await this.update_this_doc(routeID);
			await this.get_childs(this.newDocLayer);
		}
		// document.addEventListener("keyup", this.keyPressed);
	},
	mounted() {
		// const quillButtons = document.querySelectorAll(".ql-toolbar button");
		// quillButtons.forEach((element) => {
		// 	console.log(element);
		// 	element.setAttribute("tabindex", "-1");
		// });
		this.get_All_Tag();
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
</script>

<style scoped lang="stylus">
.tools {
	padding: 0px;
}
</style>
