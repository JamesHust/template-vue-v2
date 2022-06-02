<template>
    <svg class="IconDelete" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <g transform="translate(-422 -24475)">
            <rect width="20" height="20" transform="translate(422 24475)" fill="#fff" opacity="0"/>
            <g transform="translate(420 24476)">
                <path
                    d="M6,6.651A1.163,1.163,0,0,0,7.163,7.813v5.813a2.325,2.325,0,0,0,2.325,2.325H15.3a2.325,2.325,0,0,0,2.325-2.325V7.813a1.163,1.163,0,0,0,1.163-1.163V5.488a1.163,1.163,0,0,0-1.163-1.163H15.3V3.163A1.163,1.163,0,0,0,14.139,2H10.651A1.163,1.163,0,0,0,9.488,3.163V4.325H7.163A1.163,1.163,0,0,0,6,5.488Zm10.464,6.976A1.163,1.163,0,0,1,15.3,14.789H9.488a1.163,1.163,0,0,1-1.163-1.163V7.813h8.139ZM10.651,3.163h3.488V4.325H10.651ZM7.163,5.488H17.627V6.651H7.163Z"
                    :fill="color"/>
                <path
                    d="M30.581,54.651a.581.581,0,0,0,.581-.581V50.581a.581.581,0,1,0-1.163,0v3.488A.581.581,0,0,0,30.581,54.651Z"
                    transform="translate(-20.512 -41.024)" :fill="color"/>
                <path
                    d="M46.581,54.651a.581.581,0,0,0,.581-.581V50.581a.581.581,0,1,0-1.163,0v3.488A.581.581,0,0,0,46.581,54.651Z"
                    transform="translate(-34.187 -41.024)" :fill="color"/>
                <path
                    d="M62.581,54.651a.581.581,0,0,0,.581-.581V50.581a.581.581,0,1,0-1.163,0v3.488A.581.581,0,0,0,62.581,54.651Z"
                    transform="translate(-47.861 -41.024)" :fill="color"/>
            </g>
        </g>
    </svg>
</template>

<script>
import IconBase from '@/components/icons/IconBase'

export default {
    name: 'IconDelete',
    extends: IconBase
}
</script>
