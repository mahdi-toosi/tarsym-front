<template>
    <div class="createMsgStage" :class="showStage ? 'showCreateMsgStage' : ''">
        <header>
            <i class="fas fa-times" @click="CloseCreateMsgStage()"></i>
            <input type="text" placeholder="موضوع" v-model="msg.title" />
        </header>
        <textarea v-model="msg.message" rows="10"></textarea>
        <hr />
        <button @click="sendMsg()" class="btn btn-green">ارسال</button>
    </div>
</template>

<script>
export default {
    name: "sendMessage",
    data() {
        return {
            msg: {
                to: null,
                from: null,
                title: null,
                type: null,
                message: null,
                attach: null,
            },
            showStage: false,
        };
    },
    methods: {
        CloseCreateMsgStage() {
            this.msg = {
                to: null,
                from: null,
                title: null,
                type: null,
                message: null,
                attach: null,
            };
            this.showStage = false;
        },
        sendMsg() {
            // validate
            // send
            //  clear the stage
        },
    },
    mounted() {
        document.addEventListener(
            "showCreateMsgStage",
            ({ detail }) => {
                console.log(detail);
                this.showStage = true;
            },
            false
        );
    },
};
</script>

<style lang="stylus">
.createMsgStage {
    position: fixed;
    bottom: -500px;
    left: 20%;
    background: white;
    border-radius: 8px;
    width: 400px;
    overflow: hidden;
    direction: rtl;
    text-align: right;
    transition: 0.5s;
    z-index: 999;

    &.showCreateMsgStage {
        bottom: 0px;
    }

    i {
        position: absolute;
        left: 10px;
        top: 10px;
        cursor: pointer;

        &:hover {
            color: red;
        }
    }

    input {
        display: block;
        border: none;
        border-bottom: 1px gray solid;
        margin: 10px 10px 4px 10px;
        padding: 4px 0;
        width: 60%;
    }

    textarea {
        width: 94%;
        padding: 10px;
        border: none;
        resize: none;
    }

    hr {
        width: 60%;
        background: gray;
        margin: 0;
        margin-right: auto;
    }

    button {
        position: relative;
        float: left;
        margin: 10px;
        padding: 9px 30px;
    }
}
</style>