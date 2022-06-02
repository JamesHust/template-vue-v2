<template>
    <FciDialog :title="$f.tc('response')" :width="600" v-model="show" class="ScenarioItemEditor">
        <v-form v-model="formValid" ref="form" @submit="submit">
            <div class="pa-3 fci-scrollbar" style="max-height: 70vh; overflow: auto">
                <!--intent-->
                <div class="label">{{ $f.tc('intent') }}</div>
                <v-autocomplete
                    outlined dense
                    :items="intents"
                    item-text="name"
                    item-value="id"
                    :rules="formRules.required"
                    v-model="model.intent"
                ></v-autocomplete>
                <!--description-->
                <div class="label">{{ $f.tc('description') }}</div>
                <v-text-field
                    outlined dense
                    v-model="model.description"
                ></v-text-field>
                <!--type-->
                <div class="label">{{ $f.tc('type') }}</div>
                <v-select
                    outlined dense
                    :items="typeList"
                    :rules="formRules.required"
                    v-model="model.condition_type"
                ></v-select>
                <!--condition-->
                <ConditionEditor
                    ref="ConditionEditor"
                    v-model="model.conditions"
                    style="margin-top: 12px"
                ></ConditionEditor>
                <!--entity suggestion-->
                <template v-if="model.condition_type === CONDITION_TYPE.MISSING">
                    <div class="label">{{ $f.tc('entitySuggestion') }}</div>
                    <v-autocomplete
                        outlined dense
                        :items="entityTypeList"
                        item-text="name"
                        item-value="id"
                        :rules="formRules.required"
                        v-model="model.entity_suggestion"
                    ></v-autocomplete>
                </template>
                <!--query-->
                <div class="label">{{ $f.tc('query') }}</div>
                <CodeEditor v-model="model.query" :lineNumbers="true"></CodeEditor>
                <!--script-->
                <div class="label">{{ $f.tc('script') }}</div>
                <CodeEditor v-model="model.script" :lineNumbers="true"></CodeEditor>
                <!--NLG-->
                <div class="box-inner" style="margin-top: 30px">
                    <div class="title-inner">NLG</div>
                    <div class="box-inner" style="margin-top: 15px">
                        <div class="title-inner">{{$f.tc('configs')}}</div>
                        <!--entity-type-->
                        <EntitySelector ref="EntitySelector" @closeVariableSelector="closeVariableSelector" style="flex: 1"></EntitySelector>
                        <!--variable-->
                        <VariableSelector ref="VariableSelector" @closeEntitySelector="closeEntitySelector" style="flex: 1"></VariableSelector>
                    </div>
                    <div class="label" style="margin-top: 12px">{{ $f.tc('answer') }}</div>
                    <CodeEditor v-model="model.answer" :lineNumbers="true"></CodeEditor>
                    <v-btn outlined small class="align-self-start" style="margin-top: 6px; text-transform: inherit; height: 32px !important;" @click="previewItem('')">
                        <img
                                src="/img/kb/eye.svg"
                                alt="icon_show_preview"
                                style="margin-right: 2px; transform: scale(0.8)"
                        >
                        {{ $f.tc('preview') }}
                    </v-btn>
                    <div class="preview-box" v-if="previewResult" v-html="previewText(previewResult)"></div>
                    <div class="preview-box" style="color: #595959;" v-else>{{$f.tc('pleaseInputAnswerToPreview')}}</div>
                    <div class="extra-response" v-for="(item, i) in extraResponseList" :key="i">
                        <div class="label" style="margin-top: 12px !important;">{{ $f.tc('answer') }} ({{ item.name }})</div>
                        <CodeEditor v-model="extraAnswer[item.id]" :lineNumbers="true"></CodeEditor>
                        <v-btn outlined small class="align-self-start" style="margin-top: 6px; text-transform: inherit; height: 32px !important;" @click="previewItem(item.id)">
                            <img
                                    src="/img/kb/eye.svg"
                                    alt="icon_show_preview"
                                    style="margin-right: 2px; transform: scale(0.8)"
                            >
                            {{ $f.tc('preview') }}
                        </v-btn>
                        <div class="preview-box" v-if="extraAnswerPreview[item.id]" v-html="previewText(extraAnswerPreview[item.id])"></div>
                        <div class="preview-box" style="color: #595959;" v-else>{{$f.tc('pleaseInputAnswerToPreview')}}</div>
                    </div>
                </div>
            </div>
            <v-layout justify-end class="action-footer">
                <v-btn outlined @click="cancel" class="btn-custom" style="margin-right: 8px">
                    {{ $f.tc('cancel') }}
                </v-btn>
                <v-btn class="btn-custom" color="primary" type="submit">{{ $f.tc('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import { EntityTypeService, IntentService, ResponseItemService } from '@/services/project.service'
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import ConditionEditor from '@/components/ConditionEditor'
import EntitySelector from '@/views/Project/Response/EntitySelector'
import { mapState } from 'vuex'
import VariableSelector from '@/views/Project/Response/VariableSelector'
import CodeEditor from '@/modules/fptai/components/CodeEditor'
import {
    EntityTypeTemplateService,
    IntentTemplateService,
    ResponseItemTemplateService
} from '@/services/template.service'

const CONDITION_TYPE = {
    FULFILLED: 'fulfilled',
    MISSING: 'missing'
}

const defaultModel = {
    intent: '',
    description: '',
    condition_type: CONDITION_TYPE.FULFILLED,
    conditions: [],
    entity_suggestion: '',
    query: '',
    script: '',
    answer: ''
}

export default {
    name: 'ResponseItemEditor',
    components: {
        CodeEditor,
        VariableSelector,
        EntitySelector,
        ConditionEditor,
        FciDialog
    },
    mixins: [DialogEditorMixin],
    data () {
        return {
            CONDITION_TYPE,
            model: this.$ut.cloneObject(defaultModel),
            intents: [],
            entityTypeList: [],
            previewResult: '',
            extraAnswer: {},
            extraAnswerPreview: {},
            code: ''
        }
    },
    computed: {
        ...mapState({
            extraResponseList: state => state.response.extraResponseList,
            mode: state => state.mode
        }),
        typeList () {
            return [
                {
                    text: this.$f.tc('fulfilled'),
                    value: CONDITION_TYPE.FULFILLED
                }, {
                    text: this.$f.tc('missing'),
                    value: CONDITION_TYPE.MISSING
                }
            ]
        }
    },
    mounted () {
        this.loadIntentList()
        this.loadEntityTypeList()
    },
    methods: {
        onOpen (item) {
            this.previewResult = ''
            this.extraAnswerPreview = {}
            this.extraAnswer = {}
            if (item) {
                const listExtraAnswer = Object.keys(item.extra_answers)
                listExtraAnswer.forEach(nameExtraAnswer => {
                    let extraAnswer = this.extraResponseList.find(i => i.name === nameExtraAnswer)
                    if (extraAnswer) {
                        this.extraAnswer[extraAnswer.id] = item.extra_answers[nameExtraAnswer]
                    }
                })
                for (let i in this.model) {
                    this.model[i] = item[i]
                }
                this.model.override_result = JSON.stringify(item.override_result)
                for (let condition of this.model.conditions) {
                    condition.operator = this.$utils.decodeHTMLEntities(condition.operator)
                }
            } else {
                this.model = this.$ut.cloneObject(defaultModel)
            }
            this.clearFormValidation()
        },
        loadIntentList () {
            let itemService = this.mode === 'projects' ? IntentService : IntentTemplateService
            itemService.search(this.$route.params.projectId).then(result => {
                this.intents = result.data
                console.log(this.intents)
            })
        },
        loadEntityTypeList () {
            let itemService = this.mode === 'projects' ? EntityTypeService : EntityTypeTemplateService
            itemService.search(this.$route.params.projectId).then(result => {
                this.entityTypeList = result.data
            })
        },
        submitValidForm () {
            try {
                this.close()
                this.model.conditions = this.$refs.ConditionEditor.getConditions()
                let data = {
                    ...this.model,
                    extra_answers: this.extraAnswer
                }
                this.promise.resolve(data)
            } catch (e) {
                this.$appService.inform('override result does not in json format')
            }
        },
        // createPreview () {
        //     let itemService = this.mode === 'projects' ? ResponseItemService : ResponseItemTemplateService
        //     if (this.model.answer) {
        //         itemService.preview(this.$route.params.projectId, {
        //             query: this.model.query,
        //             answer: this.model.answer,
        //             entities: this.$refs.EntitySelector.getEntities(),
        //             variables: this.$refs.VariableSelector.getVariables(),
        //             script: this.model.script
        //         }).then(result => {
        //             this.previewResult = result.data
        //             this.$forceUpdate()
        //         })
        //     }
        //     this.extraResponseList.forEach(item => {
        //         if (this.extraAnswer[item.id]) {
        //             itemService.preview(this.$route.params.projectId, {
        //                 query: this.model.query,
        //                 answer: this.extraAnswer[item.id],
        //                 entities: this.$refs.EntitySelector.getEntities(),
        //                 variables: this.$refs.VariableSelector.getVariables()
        //             }).then(result => {
        //                 this.extraAnswerPreview[item.id] = result.data
        //                 this.$forceUpdate()
        //             })
        //         }
        //     })
        // },
        previewItem (id) {
            let responseItemService = this.mode === 'projects' ? ResponseItemService : ResponseItemTemplateService
            responseItemService.preview(this.$route.params.projectId, {
                response_item: {
                    intent_id: this.model.intent,
                    conditions: this.$refs.ConditionEditor.getConditions(),
                    condition_type: this.model.condition_type,
                    script: this.model.script,
                    query: this.model.query
                },
                entities: this.$refs.EntitySelector.getEntities(),
                variables: this.$refs.VariableSelector.getVariables(),
                nlg_template: id ? this.extraAnswer[id] : this.model.answer
            }).then(result => {
                if (id) {
                    this.extraAnswerPreview[id] = result.data
                } else {
                    this.previewResult = result.data
                }
                this.$forceUpdate()
            })
        },
        cancel () {
            this.show = false
            this.promise.reject(false)
        },
        previewText (text) {
            const checkDownLine = text.includes('\n')
            if (checkDownLine) {
                let lines = text.split('\n')
                let result = lines[0]
                lines.forEach((line, index) => {
                    if (index > 0) {
                        result += `<br/>${line}`
                    }
                })
                return result
            } else return text
        },
        closeEntitySelector () {
            this.$refs.EntitySelector.isMenuVisible = false
        },
        closeVariableSelector () {
            console.log(1)
            this.$refs.VariableSelector.isMenuVisible = false
        }
    },
    watch: {
        extraResponseList () {
            this.extraResponseList.forEach(item => {
                this.$set(this.extraAnswer, item.id, '')
                this.$set(this.extraAnswerPreview, item.id, '')
            })
        }
    }
}
</script>

<style scoped lang="scss">
.v-select {
    ::v-deep .v-input__slot {
        height: 32px !important;
    }

    ::v-deep .v-text-field__details {
        right: 20px;
    }
}

::v-deep .v-input__slot {
    min-height: 32px !important;
    font-size: 14px;
    margin-bottom: 0 !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
    color: #D9D9D9 !important;
}

::v-deep .v-list-item .v-list-item__title {
  font-size: 14px !important;
  font-weight: 400 !important;
}

::v-deep .v-text-field__details {
    margin-bottom: 3px !important;
}

::v-deep .v-text-field__details {
    position: absolute;
    right: 0;
    top: 10px;
}

::v-deep .mdi-menu-down::before {
  content: url("/img/select.svg");
  height: 32px !important;
}

::v-deep .v-input__icon {
  min-width: 14px !important;
  width: 14px !important;
}

::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px !important;
}

::v-deep .v-btn--outlined {
    border: 1px solid #D9D9D9 !important;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
}

.label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 6px;
    margin-top: 12px;

    &:first-child {
        margin-top: 0 !important;
    }
}

.action-footer {
    border-top: 1px solid #D9D9D9;
    padding: 8px 12px;
}

.preview-box {
    background: #F5F3F3;
    margin-top: 6px;
    padding: 12px 12px;
    font-style: italic;
    font-size: 14px;
}

.btn-custom {
    text-transform: inherit !important;
    font-weight: 400;
    padding: 5px 16px !important;
    font-size: 14px;
    height: 32px !important;
}

.box-inner {
  border: 1px solid #D9D9D9;
  //border-radius: 5px;
  position: relative;
  padding: 12px;
}

.title-inner {
  position: absolute;
  left: 10px;
  top: -15px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: bold;
  background: #FFFFFF;
}

.extra-response {
  margin-top: 12px;
  border-top: 1px solid #D9D9D9;
}
</style>
