<script>
import FormRules from '../utils/FormRules'

export default {
    data () {
        return {
            formValid: false,
            formRules: {
                ...FormRules,
                required: [FormRules.ruleRequired],
                email: [FormRules.ruleRequired, FormRules.ruleEmail],
                projectName: [FormRules.ruleRequired, FormRules.ruleProjectName]
            }
        }
    },
    methods: {
        submit (event) {
            if (event) {
                event.preventDefault()
            }
            if (this.formValid) {
                this.submitValidForm()
            } else if (this.$refs.form) {
                this.$refs.form.validate()
            }
        },
        submitValidForm () {
        },
        clearForm () {
            if (this.$refs.form) {
                this.$refs.form.reset()
            }
        },
        clearFormValidation () {
            if (this.$refs.form) {
                this.$refs.form.resetValidation()
            }
        }
    }
}
</script>
