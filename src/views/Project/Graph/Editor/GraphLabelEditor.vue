<template>
    <div>
        <div style="height: 22px; position: relative" class="layout-input-label">
            <input
                type="text"
                class="fci-input spreadX"
                v-model="newLabel"
                @keypress.enter="addLabel"
            >
            <v-btn small icon class="icon-add-label" @click="addLabel">
                <img
                    src="/img/graph/plus.svg"
                    alt="icon_add_label"
                >
            </v-btn>
        </div>
        <div class="fci-error-message" style="font-size: 12px; margin-top: 3px">
            {{ errorMessage }}
        </div>
        <v-layout wrap>
            <div
                v-for="(label, i) in labelList"
                :key="i" class="fci-label"
                :style="{backgroundColor: getLabelColor(label)}"
            >
                {{ label }}
                <v-btn icon small @click="deleteLabel(i)">
                    <img
                        src="/img/graph/remove_label.svg"
                        alt="icon_add_label"
                    >
                </v-btn>
            </div>
        </v-layout>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'GraphLabelEditor',
    props: {
        value: Array,
        validateLabel: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            newLabel: '',
            labelList: [],
            errorMessage: ''
        }
    },
    computed: {
        ...mapState({
            kbConfig: state => state.kg.config
        })
    },
    methods: {
        getLabelColor (label) {
            let color = this.kbConfig.style.map_label_color[label]
            return color || '#F0F0F0'
        },
        addLabel () {
            if (!this.newLabel) {
                return
            }
            if (this.errorMessage) {
                return
            }
            if (!this.labelList.includes(this.newLabel)) {
                this.labelList.push(this.newLabel)
                this.save()
            }
            this.newLabel = ''
        },
        deleteLabel (index) {
            this.$appService.confirm(
                this.$f.tc('confirmDelete', { item: this.labelList[index] })
            ).then(confirm => {
                if (confirm) {
                    this.labelList.splice(index, 1)
                    this.save()
                }
            })
        },
        save () {
            if (!this.$ut.cov(this.labelList, this.value)) {
                this.$emit('input', this.labelList)
                this.$emit('save', this.labelList)
            }
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                if (!this.$ut.cov(this.labelList, this.value)) {
                    this.labelList = this.$ut.cloneObject(this.value)
                }
            }
        },
        newLabel () {
            if (this.newLabel) {
                if (this.validateLabel) {
                    let reg = /^[a-zA-Z0-9_]*$/g
                    if (reg.test(this.newLabel)) {
                        this.errorMessage = ''
                    } else {
                        this.errorMessage = this.$f.tc('require') + ': a-z A-Z 0-9 _'
                    }
                }
            } else {
                this.errorMessage = ''
            }
        }
    }
}
</script>

<style scoped lang="scss">

.v-btn--icon.v-size--small {
    height: 22px;
    width: 22px;
}

.layout-input-label {
    margin-top: 6px;

    &:hover .icon-add-label {
        visibility: visible;
    }

    .icon-add-label {
        visibility: hidden;
        position: absolute;
        right: 10px;
        top: 1px;

    }

}

.fci-label {
    border: none;
    border-radius: 0;
    margin: 8px 3px 0 0;
    display: flex;
    align-items: center;
    width: fit-content;
}

.logo {
    width: 110px;
    height: 40px;
    cursor: pointer;
}
</style>
