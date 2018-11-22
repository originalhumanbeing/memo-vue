<template>
    <div class="wrapper">
        <div class="authFailMsg" v-if="!authState.authSuccess">{{ authState.authFailMsg }}</div>
        <form id="auth" method="post" v-if="authState.beforeLogin">
            <input type="text" id="id" name="id" placeholder="email@email.com" v-model="user.id">
            <input type="password" id="pwd" name="pwd" placeholder="password" v-model="user.pwd">
            <input type="submit" id="loginBtn" value="login" v-on:click="login">
        </form>
        <div id="userNav" v-if="!authState.beforeLogin">
            <p id="userNickname" v-if="!authState.beforeLogin"> {{ user.nickname + ' 님' }}</p>
            <button id="logoutBtn" v-on:click="logout">logout</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Auth",
        data() {
            return {
                authState: {
                    beforeLogin: true,
                    authSuccess: true,
                    authFailMsg: ''
                },
                user: {
                    id: '',
                    nickname: '',
                    pwd: '',
                    lastwork: ''
                }
            }
        },
        methods: {
            login(e) {
                e.preventDefault();

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                fetch(`http://localhost:5000/login`, {
                    method: 'post',
                    headers: myHeaders,
                    body: JSON.stringify({id: this.user.id, pwd: this.user.pwd})
                }).then(res => res.json()).then(userInfo => {
                    if (!userInfo['body'] || !userInfo['body'].isLogin) {
                        this.authState.authSuccess = false;
                        this.authState.authFailMsg = userInfo['body'];
                        return;
                    }
                    this.$bus.$emit('show-memo', userInfo);
                    // textarea 작업 내용 채우는 것을 호출하는 이벤트 버스
                    // this.$emit('show-list', userInfo);
                    // showlist 호출하는 이벤트 버스
                    console.log(userInfo);
                    this.user.nickname = userInfo['body'].nickname;
                    this.authState.authSuccess = true;
                    this.authState.beforeLogin = false;

                    // // if (!userInfo['lastwork']) {
                    // //     this.user.currentFile = '';
                    // //     this.memo.content = '';
                    // // } else {
                    // //     this.user.currentFile = userInfo['lastwork'].title;
                    // //     this.memo.content = userInfo['lastwork'].content;
                    // //     this.memo.cursorStart = userInfo['lastwork'].cursorStart;
                    // //     this.memo.cursorEnd = userInfo['lastwork'].cursorEnd;
                    // //     this.$refs.memo.setSelectionRange(this.memo.cursorStart, this.memo.cursorEnd);
                    // //     this.$refs.memo.focus();
                    // //     this.user.nickname = userInfo['body'].nickname;
                    // //     this.showList();
                    // //     this.user.connectionState.authFailMsgShow = false;
                    // //     this.user.connectionState.beforeLogin = false;
                    // }
                })
            },
            logout() {
                this.user.id = '';
                this.user.pwd = '';
                this.user.nickname = '';
                this.authState.beforeLogin = true;

                this.$emit('empty-memo');
                // textarea 내용 비우는 이벤트 호출하는 버스
                // this.user.currentFile = '';
                // this.memo.content = '';
            }
        }
    }
</script>

<style scoped>

</style>