<template>
    <svg class="IconEdit" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <g id="Icon" transform="translate(-422 -24475)">
            <rect
                width="20"
                height="20"
                transform="translate(422 24475)"
                fill="#fff"
                opacity="0"
            />
            <g transform="translate(423.205 24478.172)">
                <path
                    d="M6.247,12.035l.36-.36L3.329,8.4,10.7,1.024a1.738,1.738,0,0,1,2.458,0l.819.819a1.738,1.738,0,0,1,0,2.458Zm-.463.455a1.738,1.738,0,0,1-1.126.414H2.39a.29.29,0,0,1-.29-.29V10.347a1.738,1.738,0,0,1,.414-1.126Z"
                    transform="translate(0 0)"
                    :fill="color"
                    fill-rule="evenodd"
                />
            </g>
        </g>
    </svg>
</template>

<script>
import IconBase from '@/components/icons/IconBase'

export default {
    name: 'IconEdit',
    extends: IconBase
}
</script>
