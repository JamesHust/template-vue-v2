<template>
    <FciDialog :title="$f.tc('permissions')" v-model="show">
        <v-form ref="form" v-model="formValid" @submit="submit" class="pa-3">
            <v-text-field
                outlined dense
                :label="$f.tc('email')"
                v-model="model.user"
                :rules="[formRules.ruleEmail, formRules.ruleRequired, ruleAddPermissionYourself]"
            ></v-text-field>
            <v-select
                outlined dense
                :label="$f.tc('role')"
                v-model="model.role"
                :items="roleList"
                :rules="formRules.required"
            ></v-select>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'

export default {
    name: 'ProjectUserRoleEditor',
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                user: '',
                role: ''
            },
            roleList: ['ADMIN', 'DATA_EDITOR', 'TESTER', 'VIEWER']
        }
    },
    methods: {
        onOpen (item) {
            if (item) {
                this.model.user = item.user.email
                this.model.role = item.role
            } else {
                for (let i in this.model) {
                    this.model[i] = ''
                }
            }
            this.clearFormValidation()
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.model)
        },
        ruleAddPermissionYourself (value) {
            let result = true
            if (value) {
                const val = value.trim()
                if (this.$store.state.user.profile.email === val) {
                    result = false
                }
            }
            return result || window.vueapp.$t('formRules.cannotAddPermissionYourself')
        }
    }
}
</script>

<style scoped lang="scss">

</style>
