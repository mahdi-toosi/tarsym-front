<template>
	<div class="newpoint">
		<header>
			<button class="btn btn-red ml1" @click="CANSEL_CREATE_DOCUMENTS()">
				منصرف شدم
				<i class="fas fa-times"></i>
			</button>
			<button class="btn btn-green" @click="Create_Documents()">
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
				/>
				<date-picker class="datepicker" :docLayer="newDocProp.index" />
			</section>
			<section class="tools shadow">
				<br />
				<div class="tabs">
					<span @click="tabContent = 'layers'" :class="tabContent == 'layers' ? 'activeTab' : ''">layers</span>
					<span @click="tabContent = 'tools'" :class="tabContent == 'tools' ? 'activeTab' : ''">tools</span>
				</div>
				<div class="content">
					<div class="tools-content" v-show="tabContent == 'tools'">
						<ul class="tools">
							<li v-for="(tool, index) in newDocLayer.tools" :key="index">
								<new-point :tool="tool" :index="index" v-if="tool.type == 'Point'" />
								<new-polygon :tool="tool" :index="index" v-if="tool.type == 'Polygon'" />
								<new-polyline :tool="tool" :index="index" v-if="tool.type == 'Polyline'" />
							</li>
						</ul>
						<gooey-menu />
					</div>
					<div class="layers-content" v-show="tabContent == 'layers'">
						<ul>
							<li v-for="(child, index) in newDocChilds" :key="index">
								<button
									@click="goToChild(child._id ? child._id : child.id)"
									class="btn btn-green"
								>{{ child.title ? child.title : child.id }}</button>
								<button
									@click="Delete_this_Document(child._id ? child._id : child.id)"
									class="delete_button"
								>
									<i class="far fa-trash-alt"></i>
								</button>
							</li>
						</ul>
						<button @click="addNewDoc(false)" class="btn btn-blue">add child</button>
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
				{ direction: "rtl" }
			],
			[{ header: [2, 3, false] }],
			["clean"]
		];
		return {
			mahdi: false,
			tabContent: "tools",
			quillEditorOptions: {
				modules: { toolbar: toolbarOptions },
				theme: "snow",
				placeholder: "توضیحات ..."
			},
			defaultColor: "#FF0000"
		};
	},
	methods: {
		...mapMutations(["CANSEL_CREATE_DOCUMENTS", "SET_CHOSEN_TAG"]),
		...mapActions([
			"Create_Documents",
			"addNewDoc",
			"goBack",
			"goToChild",
			"Delete_this_Document",
			"update_this_doc",
			"get_childs"
		])

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
			"chosenTags"
		]),
		newPointTitle: {
			get() {
				return this.newDocLayer.title;
			},
			set(val) {
				return (this.newDocLayer.title = val);
			}
		},
		newPointDescription: {
			get() {
				return this.newDocLayer.description;
			},
			set(val) {
				return (this.newDocLayer.description = val);
			}
		}
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
	components: {
		datePicker,
		quillEditor,
		gooeyMenu,
		newPoint,
		newPolygon,
		newPolyline
	}
};
</script>

<style scoped lang="stylus">
.tools {
	padding: 0px;

	li {
		border-top: 1px solid gray;
		border-bottom: 1px solid gray;
		padding: 5px;
		list-style-type: none;
	}
}
</style>
