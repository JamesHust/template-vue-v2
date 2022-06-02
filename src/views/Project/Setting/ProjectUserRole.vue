<template>
    <div class="ProjectUserRole pa-3">
        <v-layout align-center class="mb-3">
            <div>
                <b>{{ $f.tc('owner') }}</b>: {{ owner }} <span class="mx-3"></span>
                <b>{{ $f.tc('yourRole') }}</b>: {{ userRole }}
            </div>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="createItem" v-if="this.userRole === 'owner' || this.userRole === ROLE_PERMISSION.ADMIN">{{ $t('add') }}</v-btn>
        </v-layout>
        <FciDataTable
            :headers="headers"
            :items="items"
        >
            <template v-slot:action="props">
                <v-btn icon small @click="editItem(props.item)" v-if="checkRoleToAction(props.item)" class="mr-3">
                    <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteItem(props.item)" v-if="checkRoleToAction(props.item, true)">
                    <v-icon small>mdi-delete</v-icon>
                </v-btn>
            </template>
        </FciDataTable>
        <ProjectUserRoleEditor ref="ItemEditor"></ProjectUserRoleEditor>
    </div>
</template>

<script>
import ListViewMixin from '@/modules/fptai/mixins/ListViewMixin'
import { ProjectService, ProjectUserRoleService } from '@/services/project.service'
import ProjectUserRoleEditor from '@/views/Project/Setting/ProjectUserRoleEditor'
import { ROLE_PERMISSION } from '@/utils/const'
import { mapState } from 'vuex'
import { ProjectTemplateService, ProjectTemplateUserRoleService } from '@/services/template.service'

export default {
    name: 'ProjectUserRole',
    components: { ProjectUserRoleEditor },
    mixins: [ListViewMixin],
    data () {
        return {
            owner: '',
            ROLE_PERMISSION,
            itemService: this.mode === 'projects' ? ProjectUserRoleService : ProjectTemplateUserRoleService
        }
    },
    computed: {
        ...mapState({
            userRole: state => state.project ? state.project.user_role : '',
            userEmail: state => state.user ? state.user.profile.email : '',
            mode: state => state.mode
        }),
        headers () {
            return [
                {
                    text: this.$f.tc('email'),
                    value: 'user_email'
                }, {
                    text: this.$f.tc('role'),
                    value: 'role'
                }, {
                    text: this.$f.tc('action'),
                    value: 'action'
                }
            ]
        }
    },
    mounted () {
        this.itemService = this.mode === 'projects' ? ProjectUserRoleService : ProjectTemplateUserRoleService
        this.refresh()
        this.getProjectOwner()
    },
    methods: {
        refresh () {
            this.itemService.search(this.$route.params.projectId).then(result => {
                this.items = result.data
                this.items.forEach(item => {
                    item.user_email = item.user.email
                })
            })
        },
        getProjectOwner () {
            let projectService = this.mode === 'projects' ? ProjectService : ProjectTemplateService
            projectService.getOwner(this.$route.params.projectId).then(result => {
                this.owner = result.data
            })
        },
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                if (this.checkExistUser(model.user)) {
                    return this.$appService.toastError(this.$f.tc('emailIsExist'))
                }
                return this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            this.$refs.ItemEditor.open(item).then(model => {
                return this.itemService.update(this.$route.params.projectId, item.id, model)
            }).then(() => {
                this.refresh()
            })
        },
        deleteItem (item) {
            this.$appService.confirm(
                this.$f.tc('confirmDelete', { item: item.user.email })
            ).then(() => {
                return this.itemService.delete(this.$route.params.projectId, item.id)
            }).then(() => {
                this.refresh()
            })
        },
        checkExistUser (userEmail) {
            let check = false
            const email = userEmail.trim()
            for (let i of this.items) {
                if (i.user.email === email) {
                    check = true
                    break
                }
            }
            return check
        },
        checkRoleToAction (item, isActionDelete) {
            if (item.user.email === this.userEmail) {
                return isActionDelete
            }
            return this.userRole === 'owner' || this.userRole === ROLE_PERMISSION.ADMIN
        }
    }
}
</script>

<style scoped lang="scss">

</style>
