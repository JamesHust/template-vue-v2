import Vue from 'vue'
import store from '@/store/store'
import { actionTypes } from '@/store/store.type'
import { AppEventBus, AppEventBusType } from '@/eventbus/app.eventbus'
import $filters from '@/modules/fptai/filters/filters'

const AppService = {
    promise: {},
    loading (show = true) {
        store.dispatch(actionTypes.LOADING, show)
    },
    showLoading () {
        store.dispatch(actionTypes.LOADING, true)
    },
    hideLoading () {
        store.dispatch(actionTypes.LOADING, false)
    },
    confirm (message, notice) {
        return AppService.useEventBus(AppEventBusType.CONFIRM, {
            message: message,
            messageNotice: notice || ''
        })
    },
    inform (message, options) {
        AppEventBus.emit(AppEventBusType.INFORM, {
            message,
            options
        })
    },
    closeInform () {
        AppEventBus.emit(AppEventBusType.CLOSE_INFORM)
    },
    toast (message, type, duration) {
        AppEventBus.emit(AppEventBusType.TOAST, {
            group: 'app',
            title: '',
            text: message,
            duration: duration || 3000,
            type: type
        })
    },
    toastSuccess (message) {
        this.toast(message, 'success')
    },
    toastError (message) {
        this.toast(message, 'error', 30000)
    },
    toastInfo (message) {
        this.toast(message, 'info')
    },
    toastWarning (message) {
        this.toast(message, 'warning')
    },
    handleRequestSuccess (alternateMessage) {
        return () => {
            this.toastSuccess(alternateMessage || window.vueapp.$t('successful'))
        }
    },
    handleRequestError (alternateErrorMessage, hideLoading = false) {
        return error => {
            if (hideLoading) {
                this.hideLoading()
            }
            if (error.response && error.response.data) {
                const data = error.response.data
                let errorMessage = ''
                if (Array.isArray(data)) {
                    errorMessage = data.join('')
                } else if (typeof data === 'object') {
                    if (data.message) {
                        errorMessage = data.message
                    } else {
                        errorMessage = JSON.stringify(data)
                    }
                }
                this.toastError(errorMessage)
            } else if (alternateErrorMessage) {
                this.toastError(alternateErrorMessage)
            } else {
                this.toastError(window.vueapp.$t('error'))
            }
        }
    },
    correctHeaders (headers, sortable) {
        for (let header of headers) {
            header.text = $filters.capitalize(header.text)
            header.sortable = sortable || header.sortable || false
            header.visible = typeof header.visible === 'boolean' ? header.visible : true
        }
        return headers.filter(item => item.visible)
    },
    getLocale () {
        return window.vueapp.$i18n.locale.split('-')[0]
    },
    mapPagination (pagination) {
        let str = 'page=' + pagination.page
        str += '&page_size=' + pagination.rowsPerPage
        if (pagination.sortBy) {
            let orderDirection = pagination.descending ? '-' : ''
            str += '&ordering=' + orderDirection + pagination.sortBy
        }
        return str
    },
    mapPaginationQuery (pagination) {
        let query = {
            page: pagination.page,
            page_size: pagination.rowsPerPage
        }
        if (pagination.sortBy) {
            let orderDirection = pagination.descending ? '-' : ''
            query.ordering += orderDirection + pagination.sortBy
        }
        return query
    },
    mapFilterPagination (filter) {
        if (!filter) {
            return
        }
        if (filter.page_size === null || filter.page_size === undefined) {
            if (filter.rowsPerPage !== null && filter.rowsPerPage !== undefined) {
                filter.page_size = filter.rowsPerPage
                delete filter.rowsPerPage
            }
            if (filter.pageSize !== null && filter.pageSize !== undefined) {
                filter.page_size = filter.pageSize
                delete filter.pageSize
            }
        }
        if (!filter.ordering && filter.sortBy) {
            let orderDirection = filter.descending ? '-' : ''
            filter.ordering = orderDirection + filter.sortBy
        }
        return filter
    },
    useEventBus (type, data) {
        // emit event
        AppEventBus.emit(type, data)
        // add event handler when done
        if (!AppService.promise[type]) {
            AppEventBus.on(type + '_DONE', data => {
                if (AppService.promise[type]) {
                    AppService.promise[type].resolve(data)
                }
            })
        }
        return new Promise((resolve, reject) => {
            AppService.promise[type] = {
                resolve,
                reject
            }
        })
    }
}

Vue.prototype.$appService = AppService

export default AppService
