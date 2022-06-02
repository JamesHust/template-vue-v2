<template>
<div>
    <notifications group="app" position="top right" width="350">
        <template slot="body" slot-scope="props">
            <div class="d-flex justify-space-between pa-3 notice" :style="{'background': getNoticeColor(props.item.type)}">
                <div class="d-flex align-center">
                    <v-icon style="margin-right: 8px" v-if="props.item.type === 'success'" color="white">mdi-checkbox-marked-circle-outline</v-icon>
                    <v-icon style="margin-right: 8px" v-if="props.item.type === 'info'" color="white">mdi-information </v-icon>
                    <v-icon style="margin-right: 8px" v-if="props.item.type === 'warning'" color="white">mdi-alert</v-icon>
                    <div>
                        <strong class="title">
                            {{props.item.title}}
                        </strong>
                        <div v-html="props.item.text" class="notice-content"></div>
                    </div>
                </div>
                <v-btn
                    style="margin-left: 6px"
                    small icon
                    class="close align-self-start"
                    @click="props.close"
                    v-if="props.item.type === 'error'"
                >
                    <v-icon size="18" color="white">mdi-close</v-icon>
                </v-btn>
            </div>
        </template>
    </notifications>
    <Inform ref="Inform"></Inform>
    <Confirm ref="Confirm"></Confirm>
    <LoadingComponent v-if="isShowLoading"></LoadingComponent>
    <TextEditor ref="TextEditor"></TextEditor>
    <CodeViewer ref="CodeViewer"></CodeViewer>
    <FileSelector ref="FileSelector"></FileSelector>
</div>
</template>

<script>
import Confirm from '@/modules/fptai/components/Confirm'
import Inform from '@/modules/fptai/components/Inform'
import { AppEventBus, AppEventBusType } from '@/eventbus/app.eventbus'
import LoadingComponent from '@/modules/fptai/components/LoadingComponent'
import { mapState } from 'vuex'
import TextEditor from '@/modules/fptai/components/TextEditor'
import FileSelector from '@/modules/fptai/components/FileSelector'
import CodeViewer from '@/modules/fptai/components/CodeViewer'

const MapTypeToRef = {
    [AppEventBusType.INFORM]: 'Inform',
    [AppEventBusType.CONFIRM]: 'Confirm',
    [AppEventBusType.CODE_VIEWER]: 'CodeViewer',
    [AppEventBusType.OPEN_TEXT_EDITOR]: 'TextEditor',
    [AppEventBusType.OPEN_FILE_SELECTOR]: 'FileSelector'
}

export default {
    name: 'AppServiceView',
    components: {
        CodeViewer,
        FileSelector,
        TextEditor,
        LoadingComponent,
        Confirm,
        Inform
    },
    data () {
        return {
            actionMap: {
                [AppEventBusType.CLOSE_INFORM]: () => {
                    this.$refs.Inform.close()
                },
                [AppEventBusType.TOAST]: (options) => {
                    this.$notify(options)
                }
            }
        }
    },
    computed: {
        ...mapState({
            isShowLoading: state => state.isShowLoading
        })
    },
    mounted () {
        // common for all
        AppEventBus.on('*', this.handleEvent)
        // special event
        AppEventBus.on(AppEventBusType.CLOSE_INFORM, this.actionMap[AppEventBusType.CLOSE_INFORM])
        AppEventBus.on(AppEventBusType.TOAST, this.actionMap[AppEventBusType.TOAST])
    },
    destroyed () {
        for (let i in this.actionMap) {
            AppEventBus.off(i, this.actionMap[i])
        }
    },
    methods: {
        handleEvent (type, data) {
            let refName = MapTypeToRef[type]
            if (!refName) {
                return
            }
            let promise = this.$refs[refName].open(data)
            if (promise) {
                promise.then(data => {
                    AppEventBus.emit(type + '_DONE', data)
                })
            }
        },
        getNoticeColor (type) {
            switch (type) {
                case 'success':
                    return '#4caf50'
                case 'error':
                    return '#E53935'
                case 'info':
                    return '#5cbbf6'
                case 'warning':
                    return '#ff9800'
            }
        }
    }
}
</script>

<style>
.vue-notification-group {
    padding: 12px;
    top: 64px !important;
}

.vue-notification-wrapper {
    border-radius: 5px;
    margin-bottom: 6px !important;
}

.notice-content {
    font-size: 14px;
    color: #FFFFFF;
    word-break: break-all;
}

.title {
    font-size: 14px;
    color: #FFFFFF;
    font-weight: 600;
}
</style>
