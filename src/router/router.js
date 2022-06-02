import Vue from 'vue'
import VueRouter from 'vue-router'
import ProjectTemplate from '@/components/ProjectTemplate'
import ChildView from '@/components/ChildView'
import store from '@/store/store'
import { actionTypes } from '@/store/store.type'
import AppService from '@/services/app.service'
import lodash from 'lodash'
import UserService from '@/services/user.service'

Vue.use(VueRouter)

const routes = [
    {
        path: '',
        redirect: 'projects'
    },
    // projects
    {
        path: '/projects/',
        meta: {
            requiresAuth: true
        },
        component: ProjectTemplate,
        children: [
            {
                path: '/',
                name: 'ProjectList',
                component: () => import('@/views/Project/ProjectList')
            }
        ]
    },
    {
        path: '/projects/:projectId/',
        meta: {
            requiresAuth: true
        },
        component: ProjectTemplate,
        children: [
            {
                path: '',
                redirect: 'dashboard'
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/Project/Dashboard/Dashboard')
            },
            {
                path: 'responses',
                name: 'Response',
                component: () => import('@/views/Project/Response/ResponseList')
            },
            {
                path: 'graph',
                name: 'GraphMain',
                component: () => import('@/views/Project/Graph/GraphMain')
            },
            {
                path: 'nlp',
                name: 'NLP',
                component: () => import('@/views/Project/NLP/NLP')
            },
            {
                path: 'setting',
                name: 'ProjectSetting',
                component: () => import('@/views/Project/Setting/ProjectSetting')
            }
        ]
    },
    // project-templates
    {
        path: '/project-templates/',
        meta: {
            requiresAuth: true
        },
        component: ProjectTemplate,
        children: [
            {
                path: '/',
                name: 'ProjectTemplateList',
                component: () => import('@/views/Project/ProjectList')
            }
        ]
    },
    {
        path: '/project-templates/:projectId/',
        meta: {
            requiresAuth: true
        },
        component: ProjectTemplate,
        children: [
            {
                path: '',
                redirect: 'dashboard'
            },
            {
                path: 'dashboard',
                name: 'DashboardTemplate',
                component: () => import('@/views/Project/Dashboard/Dashboard')
            },
            {
                path: 'responses',
                name: 'ResponseTemplate',
                component: () => import('@/views/Project/Response/ResponseList')
            },
            {
                path: 'ontology',
                name: 'TemplateOntology',
                component: () => import('@/views/Project/Ontology/Ontology')
            },
            {
                path: 'graph',
                name: 'GraphMainTemplate',
                component: () => import('@/views/Project/Graph/GraphMain')
            },
            {
                path: 'nlp',
                name: 'NLPTemplate',
                component: () => import('@/views/Project/NLP/NLP')
            },
            {
                path: 'setting',
                name: 'TemplateSetting',
                component: () => import('@/views/Project/Setting/ProjectSetting')
            }
        ]
    },
    {
        path: '/authentication',
        component: ChildView,
        children: [
            {
                path: '',
                name: 'authentication-options',
                component: () => import('@/views/Authentication/AuthenticationOptions.vue')
            },
            {
                path: 'failed',
                name: 'authentication-failed',
                component: () => import('@/views/Authentication/AuthenticationFailed.vue')
            },
            {
                path: 'self',
                name: 'authentication-self',
                component: () => import('@/views/Authentication/AuthenticationSelf.vue')
            },
            {
                path: 'fpt-id',
                component: ChildView,
                children: [
                    {
                        path: '',
                        name: 'authentication-fpt-id',
                        component: () => import('@/views/Authentication/AuthenticationFptId.vue')
                    },
                    {
                        path: 'success',
                        name: 'authentication-fpt-id-success',
                        component: () => import('@/views/Authentication/AuthenticationFptIdSuccess.vue')
                    }
                ]
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach(async (to, from, next) => {
    let guard = true
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.token) {
            guard = false
            store.dispatch(actionTypes.user.SIGN_IN)
        }
    }
    if (!guard) {
        return
    }

    if (to.path.includes('/projects')) {
        store.dispatch(actionTypes.MODE, 'projects')
    }
    if (to.path.includes('/project-templates')) {
        store.dispatch(actionTypes.MODE, 'project-templates')
    }

    if (to.matched.some(record => Array.isArray(record.meta.roles) && record.meta.roles.length > 0)) {
        let userRoles = null
        if (store.state.user.isProfileLoaded) {
            userRoles = store.state.user.profile.roles
        } else {
            try {
                let profileRes = await UserService.getProfile()
                userRoles = profileRes.data.roles
            } catch (e) {
                router.push('/')
            }
        }
        if (Array.isArray(userRoles)) {
            for (let record of to.matched) {
                let routeRoles = record.meta.roles
                if (Array.isArray(routeRoles) && routeRoles.length > 0) {
                    if (lodash.difference(userRoles, routeRoles).length === userRoles.length) {
                        guard = false
                        router.push({ name: 'AccessDenied' })
                        break
                    }
                }
            }
        } else {
            guard = false
        }
    }

    if (guard) {
        next()
    } else {
        AppService.toastError('access denied')
    }
})

export default router
