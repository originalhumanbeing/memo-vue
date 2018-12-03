<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import Notepad from './components/Notepad';

    export default {
        name: 'app',
        components: {
            Notepad
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
