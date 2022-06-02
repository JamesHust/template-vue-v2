<template>
    <v-layout class="centerXY screenXY">
        <div>
            <p class="title">
                <v-icon class="mr-1">mdi-emoticon-sad</v-icon>
                Something went wrong, we can not sign you in.
            </p>
            <p>
                {{$t('AuthenticationFailed.loginAgain')}}
                <v-btn to="/getting-started">{{$t('loginAgain')}}</v-btn>
            </p>
            {{$t('contactUs') | capitalize}}
            <table>
                <tr>
                    <td>
                        <v-icon class="mr-1" small>phone</v-icon>
                        {{$t('hotline') | capitalize}}
                    </td>
                    <td>0911 886 353</td>
                </tr>
                <tr>
                    <td>
                        <v-icon class="mr-1" small>email</v-icon>
                        {{$t('email') | capitalize}}
                    </td>
                    <td>support@fpt.ai</td>
                </tr>
                <tr>
                    <td style="vertical-align: top">
                        <v-icon class="mr-1" small>location_on</v-icon>
                        {{$t('address') | capitalize}}
                    </td>
                    <td v-html="address"></td>
                </tr>
            </table>
        </div>
    </v-layout>
</template>
<script>

export default {
    name: 'AuthenticationFailed',
    data () {
        return {
            address: this.$t('fptBuildingAddress').replace('\\n', '<br>')
        }
    }
}
</script>
<style scoped>
    table tr td:first-child {
        padding-right: 10px;
    }
</style>
