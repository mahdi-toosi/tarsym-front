/* eslint-disable no-console */

import {
    register
} from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.VUE_APP_DOMAIN}/service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n',
                'For more details, visit https://goo.gl/AFskqB'
            )
        },
        registered() {
            console.log('Service worker has been registered.')
        },
        cached() {
            console.log('Content has been cached for offline use.')
        },
        updatefound() {
            console.log('New content is downloading.')
            document.dispatchEvent(
                new CustomEvent('PWAupdatefound')
            );
        },
        updated() {
            console.log('New content is available; please refresh.')
            document.dispatchEvent(
                new CustomEvent('PWAupdated')
            );
        },
        offline(val) {
            console.log('No internet connection found. App is running in offline mode. => ', val)
            document.dispatchEvent(
                new CustomEvent('PWAoffline')
            );
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        }
    })
}