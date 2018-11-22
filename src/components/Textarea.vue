<template>
    <textarea class="memo" name="memo" id="memo" cols="30" rows="10" placeholder="새 메모를 작성하세요!"
              ref="memo"
              v-model="content"
              v-on:keypress="findCursor">
    </textarea>
</template>

<script>
    export default {
        name: "Textarea",
        data() {
            return {
                currentMemo: '',
                content: '',
                cursorStart: 0,
                cursorEnd: 0
            }
        },
        methods: {
            findCursor() {},
            // showMemo(userInfo) {
            //     alert(userInfo);
            // }
        },
        updated() {
            // this.$bus.on('show-memo', (userInfo) => {
            //     return this.showMemo(userInfo)
            // })
            this.$bus.$on('show-memo', console.log('hello'))
        }
    }
</script>

<style scoped>

</style>