<template>
    <v-navigation-drawer v-model="drawer" clipped fixed app class="Navigation">
        <div class="fci-list">
            <template v-for="(navItem, navIndex) in nav">
                <div
                    v-if="!navItem.disabled"
                    :key="navIndex"
                    class="fci-list-item"
                    :class="comparePath(navItem)"
                    @click="selectItem(navItem, navIndex)"
                >
                    {{ navItem.text }}
                    <template v-if="navItem.children && navItem.children.length > 0">
                        <v-flex></v-flex>
                        <v-icon v-if="openMap[navIndex]">mdi-chevron-up</v-icon>
                        <v-icon v-else>mdi-chevron-down</v-icon>
                    </template>
                </div>
                <template v-if="openMap[navIndex]">
                    <template v-for="(navSubItem, navSubIndex) in navItem.children">
                        <div
                            v-if="!navSubItem.disabled"
                            :key="navIndex + '-' + navSubIndex"
                            class="fci-list-item fci-list-sub-item"
                            :class="comparePath(navSubItem)"
                            @click="selectItem(navSubItem, navSubIndex)"
                        >
                            {{ navSubItem.text }}
                        </div>
                    </template>
                </template>
            </template>
        </div>
    </v-navigation-drawer>
</template>
<script>

import lodash from 'lodash'
import { mapState } from 'vuex'

export default {
    name: 'Navigation',
    data () {
        return {
            openMap: [false, false, false, true, true]
        }
    },
    computed: {
        ...mapState({
            mode: state => state.mode
        }),
        drawer: {
            get () {
                return this.$store.state.navigation
            },
            set (val) {
                this.$store.dispatch(this.$actionTypes.NAVIGATION, val)
            }
        },
        nav () {
            let projectId = this.$route.params.projectId
            let projectNavList = []
            if (projectId) {
                switch (this.mode) {
                    case 'projects':
                        projectNavList = [
                            // {
                            //     text: this.$f.tc('dashboard'),
                            //     path: `/projects/${projectId}/dashboard`
                            // },
                            {
                                text: this.$f.tc('nlpData'),
                                path: `/projects/${projectId}/nlp`
                            }, {
                                text: this.$f.tc('graph'),
                                path: `/projects/${projectId}/graph`
                            }, {
                                text: this.$f.tc('responses'),
                                path: `/projects/${projectId}/responses`
                            }, {
                                text: this.$f.tc('setting'),
                                path: `/projects/${projectId}/setting`
                            }
                        ]
                        break
                    case 'project-templates':
                        projectNavList = [
                            // {
                            //     text: this.$f.tc('dashboard'),
                            //     path: `/projects/${projectId}/dashboard`
                            // },
                            {
                                text: this.$f.tc('nlpData'),
                                path: `/project-templates/${projectId}/nlp`
                            },
                            {
                                text: this.$f.tc('ontology'),
                                path: `/project-templates/${projectId}/ontology`
                            },
                            {
                                text: this.$f.tc('graph'),
                                path: `/project-templates/${projectId}/graph`
                            }, {
                                text: this.$f.tc('responses'),
                                path: `/project-templates/${projectId}/responses`
                            }, {
                                text: this.$f.tc('setting'),
                                path: `/project-templates/${projectId}/setting`
                            }
                        ]
                }
            }
            let navList = projectNavList
            for (let nav of navList) {
                nav.text = this.$filters.capitalize(nav.text)
                nav.roles = nav.roles || []
                nav.open = typeof nav.open === 'boolean' ? nav.open : false
            }
            let navs = []
            let userRoles = this.$store.state.user.profile.roles
            if (userRoles) {
                for (let nav of navList) {
                    if (lodash.difference(userRoles, nav.roles).length <= userRoles.length) {
                        navs.push(nav)
                    }
                }
            }
            return navs
        }
    },
    methods: {
        selectItem (navItem, navIndex) {
            if (navItem.children) {
                this.openMap[navIndex] = !this.openMap[navIndex]
                this.$forceUpdate()
                return
            }
            if (navItem.path) {
                if (!this.comparePath(navItem)) {
                    this.$router.push(navItem.path)
                }
            } else if (navItem.link) {
                window.location.href = navItem.link
            }
        },
        comparePath (item) {
            let itemPath = this.getPath(item.path)
            let windowPath = this.getPath(window.location.pathname)
            return itemPath === windowPath ? 'active' : ''
        },
        getPath (path) {
            if (!path) {
                return ''
            }
            if (path[path.length - 1] === '/') {
                return path.substr(0, path.length - 1)
            }
            return path
        }
    }
}
</script>
<style lang="scss">
@import "src/modules/fptai/assets/css/fci-var";

.Navigation .fci-list-item {
    border-left: 5px solid $primary3;
    height: 50px;
    user-select: none;

    &.active {
        border-left-color: $primary1;
        color: $primary1;
    }
}
</style>
