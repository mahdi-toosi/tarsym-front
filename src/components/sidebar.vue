<template>
    <div class="panel">
        <router-view />
        <!-- <footer style="text-align: center">footer</footer> -->
    </div>
</template>
<script>
export default {
    name: "sidebar",
    props: {},
    data() {
        return {};
    },
    methods: {
        mediaText(media) {
            switch (media) {
                case "img":
                    return "عکس";
                case "video":
                    return "فیلم";
            }
        },
        mediaImage(media) {
            switch (media) {
                case "img":
                    return "fa-image";
                case "video":
                    return "fa-video";
            }
        },
        mediaClass(media) {
            switch (media) {
                case "img":
                    return "";
                case "video":
                    return "video";
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
