<template>
    <v-dialog v-model="show" max-width="700" persistent no-click-animation>
        <v-card style="position: relative">
            <v-layout align-center class="primary px-2 py-1">
                <div class="title" style="color: #fff">{{ $f.tc('selectProject') }}</div>
                <v-spacer></v-spacer>
                <v-btn small icon dark @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-layout>
            <div class="dialog-body">
                <div style="padding: 10px">
                    <v-text-field
                        :label="this.$f.tc('search')"
                        outlined
                        hide-details
                        dense
                        v-model="searchKey"
                    ></v-text-field>
                </div>
                <div class="fci-list">
                    <v-layout
                        v-for="project in filterProjectList"
                        :key="project.id"
                        class="fci-list-item"
                        @click="selectProject(project)"
                    >
                        <div class="mr-3">{{ project.name }}</div>
                    </v-layout>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
import DialogPromiseMixin from '@/modules/fptai/mixins/DialogPromiseMixin'

export default {
    name: 'BotSelectorDialog',
    mixins: [DialogPromiseMixin],
    data () {
        return {
            projectList: [],
            searchKey: ''
        }
    },
    computed: {
        filterProjectList () {
            let search = this.searchKey.trim().toLowerCase()
            return this.projectList.filter(bot => bot.name.toLowerCase().includes(search))
        }
    },
    methods: {
        open (projectList) {
            this.projectList = projectList
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        selectProject (project) {
            this.searchKey = ''
            this.promise.resolve(project)
            this.close()
        }
    }
}
</script>

<style scoped lang="scss">
.fci-list {
    height: 700px;
    overflow: auto;

    .fci-list-item {
        padding: 10px;
    }
}
</style>
