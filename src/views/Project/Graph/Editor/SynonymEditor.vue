<template>
    <div class="SynonymEditor">
        <textarea class="fci-input" v-model="valueInner" @blur="save"></textarea>
    </div>
</template>

<script>
export default {
    name: 'SynonymEditor',
    props: {
        value: Array
    },
    data () {
        return {
            valueInner: ''
        }
    },
    methods: {
        save () {
            this.$emit('input', this.valueInner.split(';'))
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function () {
                this.valueInner = this.value.join(';')
            }
        }
    }
}
</script>

<style scoped lang="scss">
textarea {
    width: 100%;

    &:focus {
        outline: none;
    }
}
</style>
