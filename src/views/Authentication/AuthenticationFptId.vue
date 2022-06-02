<template>
    <div>{{$t('redirecting')}}...</div>
</template>

<script>
import AuthService from '@/services/auth.service'

export default {
    name: 'AuthenticationFptId',
    created () {
        AuthService.signInFptId()
    }
}
</script>

<style scoped>

</style>
