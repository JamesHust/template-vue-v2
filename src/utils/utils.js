import Vue from 'vue'

const $utils = {
    getHostSource () {
        let protocol = window.location.protocol
        let hostname = window.location.hostname
        let port = window.location.port ? ':' + window.location.port : ''
        return protocol + '//' + hostname + port
    },
    copyToClipboard (str, notificationText) {
        const el = document.createElement('textarea')
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        if (notificationText) {
            window.vueapp.$appService.toastSuccess(notificationText)
        }
    },
    isMobile () {
        return window.vueapp.$vuetify.breakpoint.name === 'xs'
    },
    isTablet () {
        return (
            window.vueapp.$vuetify.breakpoint.name === 'sm' ||
            window.vueapp.$vuetify.breakpoint.name === 'md'
        )
    },
    isTouchDevice () {
        return window.vueapp.$vuetify.breakpoint.mdAndDown
    },
    isPC () {
        return (
            window.vueapp.$vuetify.breakpoint.name === 'lg' ||
            window.vueapp.$vuetify.breakpoint.name === 'xl'
        )
    },
    isNotMobile () {
        return !this.isMobile()
    },
    buildQuery (url, params) {
        url = url || ''
        if (params) {
            let query = []
            for (let key in params) {
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(key) && params[key] && params[key] !== '' && params[key] !== null) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                }
            }
            if (query.length) {
                url.indexOf('?') > -1 ? url += '&' + query.join('&') : url += '?' + query.join('&')
            }
        }
        return url
    },
    getLastUrlSegment (url) {
        if (!url) {
            return ''
        }
        if (url.slice(-1) === '/') {
            url = url.substring(0, url.length - 1)
        }
        url = url.substr(url.lastIndexOf('/') + 1)
        return url
    },
    noAccent (str) {
        str = str.trim().toLowerCase()
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'a')
        str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'e')
        str = str.replace(/??|??|???|???|??/g, 'i')
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'o')
        str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'u')
        str = str.replace(/???|??|???|???|???/g, 'y')
        str = str.replace(/??/g, 'd')
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
        str = str.replace(/\u02C6|\u0306|\u031B/g, '')
        return str
    },
    saveFile (data, filename, fileExtension) {
        let fileURL = window.URL.createObjectURL(new Blob([data]))
        let fileLink = document.createElement('a')
        fileLink.href = fileURL
        fileLink.setAttribute('download', filename + '' + fileExtension)
        document.body.appendChild(fileLink)
        fileLink.click()
        fileLink.parentNode.removeChild(fileLink)
    },
    convertBlobToDataURL (blob) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader()
            fileReader.readAsDataURL(blob)
            fileReader.onloadend = function () {
                resolve(fileReader.result)
            }
        })
    },
    isScrolledIntoView (elementId, parentId, shouldScrollIntoView) {
        let element = document.getElementById(elementId)
        let parent = document.getElementById(parentId)
        let elementRect = element.getBoundingClientRect()
        let parentRect = parent.getBoundingClientRect()
        let diffX = parentRect.x + parentRect.width - elementRect.x - elementRect.width
        let diffY = parentRect.y + parentRect.height - elementRect.y - elementRect.height
        let isScrolledIntoView = diffX >= 0 && diffY >= 0
        if (!isScrolledIntoView && shouldScrollIntoView) {
            parent.scrollBy(
                diffX < 0 ? 20 - diffX : 0,
                diffY < 0 ? 20 - diffY : 0
            )
        }
        return isScrolledIntoView
    },
    limitStr (str, max) {
        if (str.length > max) {
            return str.substring(0, max - 3) + '...'
        }
        return str
    },
    cloneObject (item) {
        return JSON.parse(JSON.stringify(item))
    },
    downloadJSON (data, fileName) {
        let a = document.createElement('a')
        a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
        // a.href = String.fromCharCode(parseInt(a.href, 16))
        a.setAttribute('download', fileName + '.json')
        a.click()
        a.remove()
    },
    downloadFileFromBlob (data, fileName) {
        const blob = new Blob([data])
        const url = window.URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = fileName
        anchor.click()
        window.URL.revokeObjectURL(url)
    },
    decodeJWT (token) {
        // copied from here
        // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
        let base64Url = token.split('.')[1]
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        return JSON.parse(jsonPayload)
    },
    cov (o1, o2) {
        return $utils.compareObjectValue(o1, o2)
    },
    compareObjectValue (o1, o2) {
        return JSON.stringify(o1) === JSON.stringify(o2)
    },
    buildUrl (data) {
        let url = data.url
        if (data.params) {
            url += '?'
            for (let i in data.params) {
                url += `${i}=${data.params[i]}&`
            }
            url = url.substr(0, url.length - 1)
        }
        return encodeURI(url)
    },
    getImageName (name) {
        let split = name.split(' ')
        if (split.length < 2) {
            if (name.length < 2) {
                return name.toUpperCase()
            } else {
                return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()
            }
        }
        if (split.length > 2) {
            split = [split[0], split[1]]
        }
        return split.map(word => word ? word.charAt(0).toUpperCase() : '').join('')
    },
    b64EncodeUnicode (str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes (match, p1) {
                return String.fromCharCode('0x' + p1)
            }))
    },
    b64DecodeUnicode (str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    },
    sortProperties (properties, SystemPropertyMap = {}) {
        let newProperties = {}
        Object.keys(properties).sort((a, b) => {
            if (
                SystemPropertyMap[a] !== undefined &&
                SystemPropertyMap[b] !== undefined
            ) {
                return a.localeCompare(b)
            }
            return SystemPropertyMap[a] !== undefined ? -1 : 1
        }).forEach(property => {
            newProperties[property] = properties[property]
        })
        return newProperties
    },
    decodeHTMLEntities (str) {
        str = str.replace('&gt;', '>')
        str = str.replace('&lt;', '<')
        return str
    }
}
Vue.prototype.$utils = $utils
Vue.prototype.$ut = $utils
export default $utils
