<template>
    <div class="usersPage">
        <header>
            <h1>کاربران ترسیم</h1>
            <button class="btn btn-green" @click="createNewUser()">
                <i class="fas fa-plus"></i>
                ساخت کاربر
            </button>
        </header>
        <table>
            <tbody>
                <tr>
                    <th>نام</th>
                    <th>نام کاربری</th>
                    <th>نقش</th>
                </tr>
                <tr
                    v-for="user in users.data"
                    :key="user._id"
                    :class="user.role === 1 ? 'suspended' : ''"
                >
                    <td class="name" v-text="user.name"></td>
                    <td class="name" v-text="user.username"></td>
                    <td class="role">{{ users.roles[user.role] }}</td>
                    <td class="edit">
                        <i class="far fa-edit" @click="editThisUser(user)"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="editStage" v-if="editStage.show">
            <i class="fas fa-times" @click="CloseStage()"></i>
            <label for="name">نام</label>
            <input type="text" id="name" v-model="editStage.user.name" />
            <label for="username">نام کاربری</label>
            <input
                type="text"
                id="username"
                v-model="editStage.user.username"
            />
            <label for="password" v-if="editStage.createMode"> رمز عبور </label>
            <input
                type="password"
                id="password"
                v-if="editStage.createMode"
                v-model="editStage.user.password"
            />
            <label for="rpassword" v-if="editStage.createMode">
                تکرار رمز عبور
            </label>
            <input
                type="password"
                id="rpassword"
                v-if="editStage.createMode"
                v-model="editStage.user.rpassword"
            />
            <v-select
                :options="editStageRoles"
                v-model="editStage.user.role"
                placeholder="نقش"
                class="roles"
                dir="rtl"
                :searchable="false"
                v-if="!editStage.createMode"
            />
            <p v-if="editStage.createMode">نقش : <strong>کاربر</strong></p>
            <p v-if="!editStage.createMode">
                تاریخ عضویت:
                <span>{{ editStage.user.createdAt | formatDate }}</span>
            </p>
            <button
                class="btn btn-green"
                @click="
                    editStage.createMode ? createThisUser() : updateThisUser()
                "
            >
                ذخیره
            </button>
            <hr v-if="!editStage.createMode" />
            <button
                v-if="!editStage.createMode"
                class="btn btn-red"
                @click="deleteUser(editStage.user._id)"
            >
                حذف
            </button>
        </div>
    </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
    name: "Users",
    data() {
        return {
            users: {
                data: [],
                skip: 0,
                total: 0,
                roles: {
                    3: "کاربر",
                    35: "ترسیم کننده",
                    48: "ادمین",
                    1: "تعلیق شده",
                },
            },
            editStage: {
                show: false,
                createMode: false,
                user: {},
            },
        };
    },
    methods: {
        getUsers() {
            const options = {
                params: {
                    "$sort[createdAt]": -1,
                    $limit: 30,
                },
            };
            this.$axios
                .get("/users", options)
                .then(({ data }) => {
                    this.users.data = [...this.users.data, ...data.data];
                    this.users.skip = data.skip;
                    this.users.total = data.total;
                })
                .catch((error) => {
                    this.$store.dispatch("handleAxiosError", error);
                });
        },
        updateThisUser() {
            const newUser = { ...this.trimUserData(this.editStage.user) };
            newUser.role = newUser.role.key;
            if (!this.validateUser(newUser)) return false;
            this.$axios
                .patch(`/users/${newUser._id}`, newUser)
                .then(({ data }) => {
                    const users = this.users.data;
                    const user_index = users.findIndex(
                        (user) => user._id === data._id
                    );
                    this.$set(users, user_index, data);
                })
                .catch((error) =>
                    this.$store.dispatch("handleAxiosError", error)
                );
            this.CloseStage();
        },
        editThisUser(user) {
            if (this.editStage.show) this.CloseStage();
            this.editStage.user = { ...user };
            const user_role = this.editStageRoles.filter(
                (el) => el.key === user.role
            );
            this.editStage.user.role = user_role;
            this.editStage.show = true;
        },
        createNewUser() {
            if (this.editStage.show) this.CloseStage();

            this.editStage.user = {
                name: null,
                role: { key: 3, label: "کاربر" },
                username: null,
                password: null,
                rpassword: null,
            };
            this.editStage.createMode = true;
            this.editStage.show = true;
        },
        trimUserData(user) {
            for (const key in user) {
                if (typeof user[key] === "string") user[key] = user[key].trim();
            }
            return user;
        },
        validateUser(user) {
            const errors = [];
            if (user.name.length < 5) errors.push("نام کمتر از 6 کاراکتر است");
            if (user.username.length < 5)
                errors.push("نام کاربری کمتر از 6 کاراکتر است");
            if (user.password) {
                if (user.password.length < 5)
                    errors.push("رمز عبور کمتر از 6 کاراکتر است");
                if (user.password != user.rpassword)
                    errors.push("تکرار رمز عبور صحیح نیست");
            }
            if (errors.length) {
                errors.forEach((error) => {
                    this.$toasted.error(error);
                });
                return false;
            } else return true;
        },
        createThisUser() {
            const newUser = { ...this.trimUserData(this.editStage.user) };
            delete newUser.role;
            if (!this.validateUser(newUser)) return false;
            this.$axios
                .post("/users", newUser)
                .then((res) => {
                    this.users.data.unshift(res.data);
                })
                .catch((error) => console.log({ error }));
            this.CloseStage();
        },
        CloseStage() {
            this.editStage.user = {};
            this.editStage.createMode = false;
            this.editStage.show = false;
        },
        deleteUser(_id) {
            const sure = confirm("مطمئنید که میخواهید این یوزر را حذف کنید ؟");
            if (!sure) return this.CloseStage();
            this.$axios
                .delete(`/users/${_id}`)
                .then(() => {
                    const users = this.users.data;
                    const user_index = users.findIndex((el) => el._id === _id);
                    users.splice(user_index, 1);
                })
                .catch((error) => console.log({ error }));
            this.CloseStage();
        },
    },
    computed: {
        editStageRoles() {
            const roles = this.users.roles;
            const rolesAsArray = [];
            for (const key in roles) {
                const obj = {};
                obj["key"] = Number(key);
                obj["label"] = roles[key];
                rolesAsArray.push(obj);
            }
            return rolesAsArray;
        },
    },
    filters: {
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString("fa-IR");
        },
    },
    components: {
        vSelect,
    },
    created() {
        this.getUsers();
    },
};
</script>

<style lang="stylus">
.usersPage {
    direction: rtl;

    header {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    table {
        border-spacing: 0px;
        margin: 0 auto;
    }

    td {
        padding: 5px 10px;
    }

    th {
        padding-bottom: 8px;
    }

    tr {
        td {
            border-top: gray solid 1px;
            border-left: gray solid 1px;

            &:last-child {
                border-left: none;
            }
        }

        &.suspended {
            background: orange;
        }

        .name {
            min-width: 120px;
            max-width: 200px;
        }

        .role {
            width: 80px;
            text-align: center;
        }

        .edit {
            width: 30px;
            text-align: center;

            i {
                cursor: pointer;
                transition: 0.3s;

                &:hover {
                    color: #32eb32;
                }
            }
        }
    }

    .editStage {
        position: fixed;
        top: 25%;
        right: 40%;
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        box-shadow: #b4b4b46e 0px 2px 15px 2px;

        label {
            font-size: 13px;
            margin-bottom: -9px;
        }

        input[type='text'], input[type='password'] {
            margin: 10px 0;
            border: none;
            border-bottom: 1px #a1a1a1 solid;
            padding: 5px;
        }

        p {
            font-size: 14px;
            margin: 5px 0 20px;
            text-align: center;
        }

        .roles {
            margin: 10px 0 15px;
        }

        .fa-times {
            position: absolute;
            top: 10px;
            right: 14px;
            cursor: pointer;

            &:hover {
                color: red;
            }
        }

        hr {
            width: 65%;
        }
    }
}
</style>