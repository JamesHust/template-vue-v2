<template>
    <svg class="IconCheckBoxCircle" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path
            d="M7.833,13.667a5.833,5.833,0,1,1,5.833-5.833A5.833,5.833,0,0,1,7.833,13.667Zm-.582-3.5,4.124-4.125-.825-.825-3.3,3.3L5.6,6.867l-.825.825Z"
            transform="translate(-0.833 -0.833)"
            :fill="color"
        />
    </svg>
</template>

<script>
import IconBase from '@/components/icons/IconBase'

export default {
    name: 'IconCheckBoxCircle',
    extends: IconBase
}
</script>
