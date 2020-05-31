<template>
    <article class="point shadow readPoint">
        <header>
            <img :src="readPoint.user.image" alt />
            <div class="nameandsituation">
                <a href="#" v-text="readPoint.user.name"></a>
                <a href="#" v-text="readPoint.user.situation"></a>
            </div>
            <time>
                <vue-moments-ago
                    prefix
                    suffix="قبل"
                    :date="readPoint.createdAt"
                    lang="fa"
                />
            </time>
        </header>
        <main v-html="readPoint.excerpt"></main>
        <footer>
            <!-- <ul>
						<li
							v-for="(media, index) in point.contentMedia"
							:key="index"
							:class="mediaClass(media.type)"
						>
							<i class="fas" :class="mediaImage(media.type)"></i>
							<span v-text="media.num"></span>
							{{ mediaText(media.type) }}
						</li>
			</ul>-->
        </footer>
    </article>
</template>

<script>
import { mapState } from "vuex";
// * Human readable time component
import VueMomentsAgo from "./moments-ago.vue";
export default {
    name: "readPoint",
    components: {},
    data() {
        return {};
    },
    computed: {
        ...mapState(["readPoint"])
    },
    methods: {},
    mounted() {},
    components: {
        VueMomentsAgo
    }
};
</script>

<style lang="stylus"></style>
