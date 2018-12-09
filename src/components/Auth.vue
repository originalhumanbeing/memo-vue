<template>
    <div>
        <div class="authFailMsg" v-if="user.connectionState.authFailMsgShow">{{ user.connectionState.authFailMsg }}</div>
        <form class="auth" method="post" v-if="user.connectionState.beforeLogin">
            <input type="text" class="id" name="id" placeholder="email@email.com" v-model="user.email">
            <input type="password" class="pwd" name="pwd" placeholder="password" v-model="user.pwd">
            <input type="submit" class="loginBtn" value="Log in" v-on:click="login">
            <router-link to="/signup">Sign Up</router-link>
        </form>
        <div class="userNav" v-if="!user.connectionState.beforeLogin">
            <p class="userNickname" v-if="!user.connectionState.beforeLogin"> {{ user.nickname + ' 님' }}</p>
            <button class="logoutBtn" v-on:click="logout">Log out</button>
        </div>
    </div>
</template>

<script>
import restService from '../services/restService';

export default {
    name: 'Auth',
    props : {
        onLoginSuccess : Function, 
        onLogoutSuccess : Function
    },
    data() {
        return {
            user: {
                connectionState: {
                    beforeLogin: true,
                    authFailMsg: '',
                    authFailMsgShow: false
                },
                email: '',
                nickname: '',
                pwd: '',
                token: ''
            }
        }
    },
    created() {
        const nickname = localStorage.getItem('nickname');
        const token = localStorage.getItem('token');

        if (nickname && token) {
            const loginData = {nickname, token};
            this.user.nickname = loginData.nickname;
            this.user.token = loginData.token;
            this.user.connectionState.authFailMsgShow = false;
            this.user.connectionState.beforeLogin = false;
            this.onLoginSuccess(loginData);
        }
    },
    methods: {
        login(e) {
            e.preventDefault();
            restService.login(this.user.email, this.user.pwd).then((res) => res.json()).then((loginData) => {
                if (!loginData.token || !loginData.nickname) {
                    this.user.connectionState.authFailMsgShow = true;
                    this.user.connectionState.authFailMsg = loginData.msg;
                    return;
                }
                this.user.pwd = "";
                this.user.nickname = loginData.nickname;
                this.user.token = loginData.token;
                this.user.connectionState.authFailMsgShow = false;
                this.user.connectionState.beforeLogin = false;
                this.onLoginSuccess(loginData);

                localStorage.setItem('nickname', this.user.nickname);
                localStorage.setItem('token', this.user.token);
            })
        },
        logout() {
            this.user.email = '';
            this.user.pwd = '';
            this.user.nickname = '';
            this.user.connectionState.beforeLogin = true;
            this.user.token = '';
            this.onLogoutSuccess();

            localStorage.setItem('nickname', '');
            localStorage.setItem('token', '');
        }
    }
}
    
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    font-size: 12px;
    color: #24292e;
    box-sizing: border-box;
}

button, a {
    padding: 5px 8px;
    margin: 3px;
    font-size: 0.9em;
    font-weight: 400;
    text-decoration: none;
    border-radius: 5px;
    border: 1px solid #f6f8fa;
    background-color: #ffffff;
}

.auth {
    margin: 0 5px 15px 5px;
    border-bottom: 1px solid black;
}

.auth input {
    padding: 5px 8px;
    margin: 8px 3px;
    font-size: 0.9em;
    font-weight: 400;
    border-radius: 5px;
    border: 1px solid #f6f8fa;
    background-color: #ffffff;
}

.authFailMsg {
    margin: 5px;
    padding: 0 8px;
    color: darkred;
}

.userNav {
    margin: 0 5px 15px 5px;
    border-bottom: 1px solid black;
}

.userNav . {
    padding: 5px 8px;
    margin: 10px 3px;
}

.userNickname {
    display: inline-block;
    margin-left: 15px;
}
</style>