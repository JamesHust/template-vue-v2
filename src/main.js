import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'

// filters
import './modules/fptai/filters/filters'
// plugins
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import '@/plugins/axios'
import '@/plugins/vue-notification'
// app included
import '@/utils/utils'
import '@/utils/const'
import '@/store/store.type'
import '@/eventbus/app.eventbus'
import '@/services/app.service'
// style
import '@/assets/css/common.scss'
import '@/modules/fptai/assets/css/fci-class.scss'
import '@/modules/fptai/assets/css/tm.scss'

Vue.config.productionTip = false

window.vueapp = new Vue({
    router,
    store,
    i18n,
    vuetify,
    render: h => h(App)
}).$mount('#app')
