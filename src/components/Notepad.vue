<template>
    <Notepad>
        <Textarea></Textarea>
    </Notepad>
    <!--<Menu></Menu>-->
    <!--<List></List>-->
</template>

<script>
    // import Menu from './components/Menu.vue';
    // import List from './components/List.vue';
    import Textarea from '../components/Textarea.vue';

    export default {
        name: "Notepad",
        components: {
            Textarea
        }
    }
</script>

<style scoped>

</style>