<template>
    <div class="CacheData ma-3">
        <v-btn @click="downloadCacheData">
            <v-icon class="mr-1">mdi-download</v-icon>
            {{ $f.tc('download') }}
        </v-btn>
        <v-btn class="ml-3" @click="createCacheData">
            <v-icon class="mr-1">mdi-pencil</v-icon>
            {{ $f.tc('createCacheData') }}
        </v-btn>
        <div class="mt-3">
            <template v-if="lastUpdated">
                {{ $f.tc('lastUpdated') }}: <b>{{ $f.formatDateTime(lastUpdated) }}</b>
            </template>
            <template v-else>
                {{ $f.tc('noCacheExisted') }}
            </template>
        </div>
    </div>
</template>

<script>
import { ProjectService } from '@/services/project.service'

export default {
    name: 'CacheData',
    data () {
        return {
            lastUpdated: ''
        }
    },
    mounted () {
        this.getLastUpdatedCacheData()
    },
    methods: {
        downloadCacheData () {
            let projectId = this.$route.params.projectId
            ProjectService.downloadCacheNLPData(projectId).then((result) => {
                window.open(result.data.url, '_self')
            })
        },
        createCacheData () {
            this.$appService.showLoading()
            ProjectService.createCacheNLPData(this.$route.params.projectId).then(() => {
                this.getLastUpdatedCacheData()
            }).finally(this.$appService.hideLoading)
        },
        getLastUpdatedCacheData () {
            ProjectService.getLastUpdatedCacheData(this.$route.params.projectId).then(result => {
                this.lastUpdated = result.data.last_modified
            })
        }
    }
}
</script>

<style scoped lang="scss">

</style>
