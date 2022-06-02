import $http from '@/plugins/axios'
import AppService from '@/services/app.service'

const getUrl = (baseNameList, idList) => {
    let url = ''
    for (let i = 0; i < baseNameList.length; i++) {
        url += baseNameList[i] + '/'
        if (i < idList.length) {
            url += idList[i] + '/'
        } else {
            break
        }
    }
    return url
}

export const BaseService = (...args) => {
    return {
        baseNameList: args,
        search (...params) {
            const filter = params.length === args.length ? params[params.length - 1] : null
            const url = getUrl(args, params.length === args.length ? params.slice(0, params.length - 1) : params)
            return $http.get(url, { params: AppService.mapFilterPagination(filter) })
        },
        create (...params) {
            const model = params[params.length - 1]
            const url = getUrl(args, params.slice(0, params.length - 1))
            return $http.post(url, model)
        },
        read (...params) {
            const url = getUrl(args, params)
            return $http.get(url)
        },
        update (...params) {
            const model = params[params.length - 1]
            const url = getUrl(args, params.slice(0, params.length - 1))
            return $http.patch(url, model)
        },
        replace (...params) {
            const model = params[params.length - 1]
            const url = getUrl(args, params.slice(0, params.length - 1))
            return $http.put(url, model)
        },
        delete (...params) {
            const url = getUrl(args, params)
            return $http.delete(url)
        }
    }
}

export default BaseService
