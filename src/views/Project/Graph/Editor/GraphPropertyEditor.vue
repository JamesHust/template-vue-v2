<template>
    <div>
        <table class="GraphPropertyEditor">
            <template v-for="(property, i) in propertyList">
                <tr :key="i" v-if="!property.isHiddenProperty">
                    <td :class="{'system-property': property.isSystemProperty, 'name-prop': true}">
                        {{ property.name }}
                    </td>
                    <td class="value-prop">
                    <textarea
                        class="fci-input spreadX"
                        v-model="property.value"
                        @focusout="save"
                        @keypress.enter="save"
                        :disabled="!property.isEditable"
                    />
                        <div class="icon-delete-prop">
                            <v-btn small icon v-if="!property.isSystemProperty" @click="deleteProperty(i)">
                                <img
                                    src="/img/graph/delete.svg"
                                    alt="icon_delete_prop"
                                >
                            </v-btn>
                        </div>
                    </td>
                </tr>
            </template>
            <tr>
                <td class="name-prop">
                    <input
                        type="text"
                        class="fci-input spreadX"
                        v-model="newPropertyName"
                        @keypress.enter="addProperty($event)"
                        ref="newPropertyKey"
                    >
                </td>
                <td class="value-prop">
                <textarea
                    class="fci-input spreadX"
                    v-model="newPropertyValue"
                    @keypress.enter="addProperty($event)"
                    @focusout="addProperty($event)"
                    ref="newPropertyValue"
                />
                    <div class="icon-add-prop">
                        <v-btn small icon @click="addProperty($event)">
                            <img
                                src="/img/graph/plus.svg"
                                alt="icon_add_prop"
                            >
                        </v-btn>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="fci-error-message" colspan="2" height="23">
                    {{ this.newPropertyError === PROPERTY_ERROR_MESSAGES.EXISTED ? $t('propertyExisted') : '' }}
                    {{ this.newPropertyError === PROPERTY_ERROR_MESSAGES.INVALID ? $t('propertyInvalid') : '' }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import lodash from 'lodash'

const PROPERTY_ERROR_MESSAGES = {
    EXISTED: 'existed',
    INVALID: 'invalid'
}

export default {
    name: 'GraphPropertyEditor',
    props: {
        value: Object,
        systemPropertyMap: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            PROPERTY_ERROR_MESSAGES,
            newPropertyName: '',
            newPropertyValue: '',
            newPropertyError: '',
            propertyList: []
        }
    },
    methods: {
        sortPropertyList () {
            this.propertyList = lodash.orderBy(
                this.propertyList,
                ['isHiddenProperty', 'isSystemProperty', 'name'],
                ['desc', 'asc']
            )
        },
        addProperty (event) {
            if (event) {
                event.preventDefault()
                event.stopPropagation()
            }
            if (!this.newPropertyName) {
                return
            }
            if (this.systemPropertyMap[this.newPropertyName] !== undefined) {
                this.$appService.inform(this.$f.tc('doNotAddSystemProperty', { item: this.newPropertyName }))
                return
            }
            if (this.newPropertyError !== '') {
                return
            }
            this.propertyList.push({
                name: this.newPropertyName,
                value: this.newPropertyValue,
                isSystemProperty: false,
                isHiddenProperty: false,
                isEditable: true
            })
            this.newPropertyName = ''
            this.newPropertyValue = ''
            this.sortPropertyList()
            this.save()
            this.$refs.newPropertyKey.focus()
        },
        deleteProperty (index) {
            this.propertyList.splice(index, 1)
            this.save()
        },
        save () {
            if (this.newPropertyError !== '') {
                return
            }
            let properties = {}
            this.propertyList.forEach(property => {
                properties[property.name] = property.value
            })
            this.$emit('input', properties)
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                // reset new property when change node active
                this.newPropertyName = ''
                this.newPropertyValue = ''
                this.propertyList = []
                for (let i in this.value) {
                    let isSystemProperty = this.systemPropertyMap[i] !== null && this.systemPropertyMap[i] !== undefined
                    let isHiddenProperty = i.startsWith('_')
                    this.propertyList.push({
                        name: i,
                        value: this.value[i],
                        isSystemProperty: isSystemProperty,
                        isHiddenProperty: isHiddenProperty,
                        isEditable: isSystemProperty ? this.systemPropertyMap[i] : true
                    })
                }
            }
        },
        newPropertyName () {
            let key = this.newPropertyName.trim()
            const regex = /^\S*$/
            if (key.charAt(0) === '_' || !regex.test(key)) {
                this.newPropertyError = PROPERTY_ERROR_MESSAGES.INVALID
            } else {
                this.newPropertyError = this.propertyList.find(item => item.name === key) ? PROPERTY_ERROR_MESSAGES.EXISTED : ''
            }
        }
    }
}
</script>

<style scoped lang="scss">
.GraphPropertyEditor {
    width: 100%;
    max-width: 400px;

    .system-property {
        color: #0052cc;
    }

    .name-prop {
        width: 108px;
        padding: 8px 8px 0 0;
    }

    .value-prop {
        //width: 160px;
        position: relative;
        padding: 8px 0 0 0;

        &:hover .icon-delete-prop {
            visibility: visible;
        }

        &:hover .icon-add-prop {
            visibility: visible;
        }
    }

    .icon-delete-prop, .icon-add-prop {
        visibility: hidden;
        position: absolute;
        top: 7px;
        right: 10px;
    }

    .fci-input {
        height: 30px;
        min-height: 23px;
    }
}

table {
    border-spacing: 0;

    tr {
        vertical-align: top;
    }
}

.v-btn--icon.v-size--small {
    height: 22px;
    width: 22px;
}

.fci-error-message {
    font-size: 12px;
    padding-top: 5px;
}
</style>
