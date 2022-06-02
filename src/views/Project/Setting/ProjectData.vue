<template>
    <div class="ProjectToken pa-3">
        <v-layout>
            <v-btn @click="importProject">{{ $t('importProject') }}</v-btn>
            <v-btn class="ml-3" @click="exportProject">{{ $t('exportProject') }}</v-btn>
            <v-btn color="error" class="ml-3" @click="deleteProject" v-if="userRole === 'owner'">{{ $t('deleteProject') }}</v-btn>
        </v-layout>
        <ProjectImport ref="ProjectImport"></ProjectImport>
        <ProjectExport ref="ProjectExport"></ProjectExport>
        <ConfirmDeleteProject ref="ConfirmDeleteProject"></ConfirmDeleteProject>
    </div>
</template>

<script>
import { ProjectService } from '@/services/project.service'
import ProjectImport from '@/views/Project/Setting/ProjectImport'
import ProjectExport from '@/views/Project/Setting/ProjectExport'
import { mapState } from 'vuex'
import ConfirmDeleteProject from '@/views/Project/ConfirmDeleteProject'

export default {
    name: 'ProjectData',
    components: { ConfirmDeleteProject, ProjectExport, ProjectImport },
    data () {
        return {
            otp: ''
        }
    },
    computed: {
        ...mapState({
            userRole: state => state.project ? state.project.user_role : '',
            project: state => state.project
        })
    },
    methods: {
        importProject () {
            this.$refs.ProjectImport.open().then(model => {
                if (!model.isImportData && !model.isImportGraph) {
                    return this.$appService.toastInfo(this.$f.tc('pleaseSelectDataToImport'))
                }
                this.$appService.showLoading()
                ProjectService.importProject(this.$route.params.projectId, model).then(() => {
                    if (model.isImportGraph) {
                        this.$store.dispatch(this.$at.kg.CLEAR_ALL_DATA)
                    }
                    this.$appService.toastSuccess(this.$f.tc('importProjectSuccess'))
                }).finally(this.$appService.hideLoading)
            })
        },
        exportProject () {
            this.$refs.ProjectExport.open().then(model => {
                if (!model.isExportData && !model.isExportGraph) {
                    return this.$appService.toastInfo(this.$f.tc('pleaseSelectDataToExport'))
                }
                this.$appService.showLoading()
                ProjectService.exportProject(this.$route.params.projectId, model).then((result) => {
                    window.open(result.data.url, '_self')
                }).finally(this.$appService.hideLoading)
            })
        },
        deleteProject () {
            this.$refs.ConfirmDeleteProject.open(this.project).then(() => {
                ProjectService.delete(this.$route.params.projectId).then(() => {
                    this.$router.push('/')
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">

</style>
