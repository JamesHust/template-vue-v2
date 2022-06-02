<template>
    <div class="language-selector">
        <v-menu
            :nudge-width="40"
            nudge-bottom="27"
            :z-index="10000"
        >
            <template v-slot:activator="{ on }">
                <div v-on="on" v-if="self.$ut.isMobile()">
                    <div class="m-item" style="color: #fff">{{ $appService.getLocale().toUpperCase() }}</div>
                </div>
                <div v-on="on" v-else class="d-flex align-center">
                    <img
                        :src="pathIcon"
                        alt="icon_language"
                        style="margin-right: 8px"
                    >
<!--                    <span style="color: #fff; margin: 0 6px 0 8px">{{ languageMap[$i18n.locale] }}</span>-->
                    <img
                        src="/img/menu_down.svg"
                        alt="icon_down_language"
                    >
                </div>
            </template>
            <div class="fci-list">
                <div
                    class="fci-list-item"
                    :class="{active: $i18n.locale === item.value}"
                    v-for="item in availableLanguages"
                    :key="item.value"
                    @click="changeLanguage(item.value)"
                >
                    {{ item.text }}
                </div>
            </div>
        </v-menu>
    </div>
</template>
<script>
import Cookies from 'js-cookie'

export default {
    name: 'LanguageSelector',
    data () {
        let availableLanguages = [
            {
                value: 'en-US',
                text: 'English'
            },
            {
                value: 'vi-VN',
                text: 'Việt Nam'
            }
        ]
        let languageMap = {}
        availableLanguages.forEach(item => {
            languageMap[item.value] = item.text
        })
        return {
            availableLanguages,
            languageMap,
            self: this
        }
    },
    computed: {
        pathIcon () {
            let path = ''
            switch (this.$i18n.locale) {
                case 'vi-VN':
                    path = '/img/vietnam.svg'
                    break
                case 'en-US':
                    path = '/img/england.svg'
                    break
            }
            return path
        }
    },
    mounted () {
        let language = Cookies.get(this.$const.LANGUAGE)
        if (!language) {
            language = this.getNavigatorLanguage()
        }
        if (this.languageMap[language]) {
            this.changeLanguage(language)
        }
    },
    methods: {
        changeLanguage (val) {
            this.$i18n.locale = val
            Cookies.set(this.$const.LANGUAGE, val)
        },
        getNavigatorLanguage () {
            if (navigator.languages && navigator.languages.length) {
                return navigator.languages[0]
            } else {
                return navigator.language || 'en-US'
            }
        }
    }
}
</script>
<style scoped>
.language-selector {
    color: #000;
    cursor: pointer;
    position: relative;
    font-size: 14px !important;
}

.active {
    color: #649FDF;
}

.m-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    width: 34px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}

.fci-list-item {
    padding: 8px 12px !important;
    font-size: 14px !important;
}
</style>
