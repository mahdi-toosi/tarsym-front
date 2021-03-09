<template>
    <div class="gooeyMenu">
        <nav class="menu">
            <input
                type="checkbox"
                href="#"
                class="menu-open"
                name="menu-open"
                id="menu-open"
            />
            <label class="menu-open-button btn btn-blue" for="menu-open">
                <a class="plus" rel="nofollow">
                    <i class="fa fa-plus"></i>
                </a>
            </label>
            <button class="menu-item btn btn-blue" @click="setTool('Point')">
                <i class="fas fa-map-marker-alt"></i>
            </button>
            <button class="menu-item btn btn-blue" @click="setTool('Polygon')">
                <i class="fas fa-draw-polygon"></i>
            </button>
            <button class="menu-item btn btn-blue" @click="setTool('Polyline')">
                <i class="fas fa-long-arrow-alt-up"></i>
            </button>
            <button class="menu-item btn btn-blue" @click="setTool('Textbox')">
                <i class="far fa-comment-alt"></i>
            </button>
            <!-- <button class="menu-item" @click="setTool('Heatmap')">
                <i class="fas fa-fire-alt"></i>
            </button> -->
        </nav>
        <!-- filters -->
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <defs>
                <filter id="shadowed-goo">
                    <feGaussianBlur
                        in="SourceGraphic"
                        result="blur"
                        stdDeviation="10"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo"
                    />
                    <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                    <feColorMatrix
                        in="shadow"
                        mode="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
                        result="shadow"
                    />
                    <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                    <feComposite in2="shadow" in="goo" result="goo" />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                </filter>
                <filter id="goo">
                    <feGaussianBlur
                        in="SourceGraphic"
                        result="blur"
                        stdDeviation="10"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                        result="goo"
                    />
                    <feComposite in2="goo" in="SourceGraphic" result="mix" />
                </filter>
            </defs>
        </svg>
    </div>
</template>

<script>
export default {
    methods: {
        async setTool(tool) {
            await this.$store.dispatch("docs/setTool", tool);
            document.getElementById("menu-open").checked = false;
        },
    },
};
</script>