<template>
    <div class="centerXY screenXY">
        <div>
            <p class="title">
                <v-icon class="mr-1">mdi-emoticon-sad</v-icon>
                You do not have permission to access this page
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
                    <td>
                        <v-icon class="mr-1" small>location_on</v-icon>
                        {{$t('address') | capitalize}}
                    </td>
                    <td>{{$t('fptBuildingAddress')}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccessDenied'
}
</script>

<style scoped>
    table tr td:first-child {
        padding-right: 10px;
    }
</style>
