<template>
    <div class="messagesPage">
        <header>
            <h1>پیام ها</h1>
        </header>
        <ul>
            <li v-for="msgGp in msgGroups.data" :key="msgGp._id">
                <header>
                    <span v-text="contact(msgGp.members)"></span>
                    <h3 v-text="msgGp.title"></h3>
                    <time>{{ lastMsg(msgGp).createdAt | persianDate }}</time>
                </header>
                <main v-html="lastMsg(msgGp).msg"></main>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "Messages",
    data() {
        return {
            msgGroups: [],
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    methods: {
        async GETUserMessages() {
            const options = {
                params: {
                    members: this.user._id,
                    $limit: 5,
                    "$sort[updatedAt]": -1,
                },
            };
            await this.$axios
                .get("/messages", options)
                .then(async ({ data }) => {
                    data = await this.parsMsgs(data);
                    this.msgGroups = data;
                })
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        createMessage() {
            document.dispatchEvent(
                new CustomEvent("showCreateMsgStage", {
                    detail: { mahdi: true },
                })
            );
        },
        async parsMsgs(msgs) {
            await msgs.data.forEach((pms) => {
                pms.messages.forEach((msg, index) => {
                    const parsMsg = JSON.parse(msg);
                    pms.messages[index] = parsMsg;
                });
            });
            return msgs;
        },
        contact(members) {
            const contacts = members.filter((el) => el != this.user._id);
            return contacts[0];
        },
        lastMsg(msgGp) {
            return msgGp.messages[msgGp.messages.length - 1];
        },
    },
    filters: {
        persianDate(dateString) {
            return new Date(dateString).toLocaleDateString("fa-IR");
        },
    },
    mounted() {
        this.GETUserMessages();
    },
};
</script>

<style lang="stylus">
.messagesPage {
    direction: rtl;
    text-align: right;

    ul {
        list-style: none;
    }

    li {
        background: white;
        padding: 10px 15px;
        border-radius: 10px;

        header {
            margin: 0px;
        }
    }
}
</style>