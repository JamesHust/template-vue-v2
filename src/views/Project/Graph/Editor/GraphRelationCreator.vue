<template>
    <FciDialog :title="$f.tc('relation')" v-model="show">
        <v-form ref="form" v-model="formValid" @submit="submit" class="pa-3">
            <v-autocomplete
                outlined
                dense
                :label="$f.tc('start')"
                :rules="formRules.required"
                :items="listFromNode"
                v-model="model._from"
            ></v-autocomplete>
            <v-autocomplete
                outlined
                dense
                :label="$f.tc('end')"
                :rules="formRules.required"
                :items="listToNode"
                v-model="model._to"
            ></v-autocomplete>
            <v-text-field
                outlined
                dense
                :label="$f.tc('type')"
                v-model="model._type"
                :rules="[formRules.ruleRequired, ruleRelationType]"
                @keydown="onAutoFillType"
            ></v-text-field>
            <v-layout align-center style="min-height: 30px">
                <div class="mr-3">{{ $f.tc('suggestion') }} (Ctrl + Space)</div>
                <div
                    v-for="type in filterRelationTypeList"
                    :key="type"
                    class="rel-type-suggestion-item"
                    @click="selectRelation(type)"
                >
                    {{ type }}
                </div>
            </v-layout>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $f.tc('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogPromiseFormMixin from '@/modules/fptai/mixins/DialogPromiseFormMixin'
import { mapState } from 'vuex'
import kbUtils from '@/utils/kbUtils'

const defaultModel = {
    _from: '',
    _to: '',
    _type: ''
}

const NodeType = {
    NODE: 'NODE',
    HYPEREDGE: 'HYPEREDGE'
}

export default {
    name: 'GraphRelationCreator',
    components: {
        FciDialog
    },
    mixins: [DialogPromiseFormMixin],
    data () {
        return {
            NodeType,
            model: this.$ut.cloneObject(defaultModel),
            listFromNode: [],
            listToNode: []
        }
    },
    computed: {
        ...mapState({
            items: state => state.kg.nodeList.map(item => ({
                text: item._name || item._id,
                value: item._id,
                type: kbUtils.isHyperedge(item) ? NodeType.HYPEREDGE : NodeType.NODE
            })),
            relationTypeList: state => state.kg.relationTypeList
        }),
        filterRelationTypeList () {
            let typeList = this.relationTypeList
            if (this.model._type) {
                typeList = typeList.filter(item => item.startsWith(this.model._type))
            }
            if (typeList.length > 5) {
                typeList = typeList.slice(0, 5)
            }
            return typeList
        }
    },
    mounted () {
        this.$store.dispatch(this.$at.kg.GET_RELATION_TYPE_LIST, {
            projectId: this.$route.params.projectId
        })
    },
    methods: {
        open (data) {
            this.clearForm()
            this.listFromNode = this.items
            this.listToNode = this.items
            this.show = true
            this.$nextTick(() => {
                this.model = this.$ut.cloneObject(defaultModel)
                if (data) {
                    if (data._from) {
                        this.model._from = data._from
                    }
                    if (data._to) {
                        this.model._to = data._to
                    }
                }
            })
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.model)
        },
        ruleRelationType (value) {
            let reg = /^[A-Z_]*$/g
            return reg.test(value) || this.$f.tc('require') + ': A-Z _'
        },
        onAutoFillType (e) {
            if (e.keyCode === 32 && e.ctrlKey) {
                for (let type of this.filterRelationTypeList) {
                    if (type.startsWith(this.model._type)) {
                        this.model._type = type
                        return
                    }
                }
            }
        },
        selectRelation (type) {
            this.model._type = type
        },
        updateListNode (id) {
            let list = this.$ut.cloneObject(this.items)
            let idx = list.findIndex(i => i.value === id)
            if (idx >= 0 && list[idx].type === NodeType.HYPEREDGE) {
                list = list.filter(i => i.type === NodeType.NODE)
            }
            return list
        }
    },
    watch: {
        'model._from': {
            handler: function () {
                this.listToNode = this.updateListNode(this.model._from)
            }
        },
        'model._to': {
            handler: function () {
                this.listFromNode = this.updateListNode(this.model._to)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.rel-type-suggestion-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 3px;
    margin-right: 5px;
    cursor: pointer;

    &:hover {
        background: #f6f6f6;
    }
}
</style>
