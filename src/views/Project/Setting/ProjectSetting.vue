<template>
    <div class="ProjectSetting fci-page">
        <v-tabs v-model="tab">
            <v-tab v-if="mode === 'projects'">Token</v-tab>
            <v-tab>{{ $f.tc('permissions') }}</v-tab>
            <v-tab>{{ $f.tc('constant') }}</v-tab>
            <v-tab>{{ $f.tc('project') }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item v-if="mode === 'projects'">
                <ProjectToken></ProjectToken>
            </v-tab-item>
            <v-tab-item>
                <ProjectUserRole></ProjectUserRole>
            </v-tab-item>
            <v-tab-item>
                <ProjectConstant></ProjectConstant>
            </v-tab-item>
            <v-tab-item>
                <ProjectData></ProjectData>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import ProjectUserRole from '@/views/Project/Setting/ProjectUserRole'
import ProjectToken from '@/views/Project/Setting/ProjectToken'
import ProjectConstant from '@/views/Project/Setting/ProjectConstant'
import ProjectData from '@/views/Project/Setting/ProjectData'
import { mapState } from 'vuex'
export default {
    name: 'ProjectSetting',
    components: {
        ProjectData,
        ProjectConstant,
        ProjectToken,
        ProjectUserRole
    },
    data () {
        return {
            tab: 0
        }
    },
    computed: {
        ...mapState({
            mode: state => state.mode
        })
    },
    methods: {}
}
</script>

<style scoped lang="scss">
.ProjectSetting {
  background: #fff;
}
</style>
