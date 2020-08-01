import feathersClient, {
    makeServicePlugin,
    BaseModel
} from '../feathers-client'
import Vue from "vue";

class User extends BaseModel {
    constructor(data, options) {
        super(data, options)
    }
    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'User'
    // Define default properties here
    static instanceDefaults() {
        return {
            email: '',
            password: ''
        }
    }
}
const servicePath = 'users'
const servicePlugin = makeServicePlugin({
    Model: User,
    service: feathersClient.service(servicePath),
    servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [
            user => {
                console.log('user => ', user);
            }
        ],
        update: [],
        patch: [],
        remove: []
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [
            error => {
                const code = error.error.code,
                    msgs = [];
                if (code == 409) msgs.push('ایمیل تکراری است')
                showErrors(msgs)
            }
        ],
        update: [],
        patch: [],
        remove: []
    }
})

function showErrors(msgs) {
    msgs.forEach(msg => {
        Vue.toasted.error(msg, {
            position: "bottom-left",
            duration: 5 * 1000,
            keepOnHover: true,
            iconPack: "fontawesome",
            icon: "fa-close",
        });
    });

}
export default servicePlugin