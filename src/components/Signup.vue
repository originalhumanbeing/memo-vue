<template>
    <form method="post">
        <div v-if="signupMsgShow">{{ signupMsg }}</div>
        <fieldset>
            <legend>Sign up</legend>
                <div>NICKNAME</div><input type="text" name="nickname" placeholder="What should we call you?" v-model="nickname">
                <div>EMAIL</div><input type="email" name="email" placeholder="Enter your email address!!" v-model="email">
                <div>PASSWORD</div><input type="password" name="pwd" placeholder="Enter your password" v-model="pwd">
                <div>PASSWORD AGAIN</div><input type="password" name="checkpwd" placeholder="Enter your password once more" v-model="checkpwd">
                <input type="submit" value="Sign me up!" v-on:click="signup" v-bind:disabled="disabled ? true : false">
        </fieldset>
        <div id="modal" v-if="signupSuccessMsgShow">
            {{ signupSuccessMsg }}
            <button v-on:click="redirectToMain">확인</button>
        </div>
    </form>
</template>

<script>
import router from '../router/index';
import restService from '../services/restService';

export default {
    name: 'Signup',
    data() {
        return {
            nickname: '',
            email: '',
            pwd: '',
            checkpwd: '',
            signupMsg: '',
            signupMsgShow: false,
            signupSuccessMsg: '',
            signupSuccessMsgShow: false,
            disabled: false
        }
    },
    methods: {
        signup(e) {
            e.preventDefault();
            this.disabled = true;
            restService.signup(this.nickname, this.email, this.pwd, this.checkpwd).then(res => res.json()).then(data => {
                if (!data.success) {
                    this.signupMsg = data.body;
                    this.signupMsgShow = true;
                    this.disabled = false;
                    return;
                }

                // 성공시 메인 페이지로 이동
                this.signupSuccessMsg = data.msg;
                this.signupSuccessMsgShow = true;

                // 자동 로그인 (로그인하는 event emit)
                // id, pwd
                // const loginInfo = [this.email, this.pwd];
                // this.$bus.emit('login', loginInfo);
            })
        },
        redirectToMain(e) {
            e.preventDefault();
            router.push({ name: 'Memomemo' });
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

form {
    display: flex;
    width: 310px;
    height: 100%;
    margin: 50px auto;
    position: relative;
    top: 0;
    left: 0;
}

form * {
    width: 310px; 
    display: flex; 
    flex-direction: column; 
    margin: 10px 0;
}

form fieldset {
    border: 0;
}

form legend {
    text-align: center;
    font-size: 62px;
    font-weight: 700;
    margin: 60px 0 20px 0;
    padding: 0 0 20px 0;
    border-bottom: 1px solid black;
}

form div {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: rgba(55, 53, 47, 0.8);
}

form > div {
    font-size: 1.2em;
    font-weight: 600;
    color: rgb(235, 86, 86);
    text-align: center;
    position: absolute;
    top: -41px;
    padding: 10px;
    width: 320px;
    background-color: rgba(235, 86, 86, 0.06);
    border: 1px solid rgb(235, 86, 86);
    border-radius: 3px;
}

form input {
    padding: 8px 10px;
    font-size: 1.1em;
    font-weight: 400;
    border-radius: 3px;
    border: 1px solid rgba(55, 53, 47, 0.5);
    background-color: #ffffff;
}

form input[type="submit"] {
    background-color: rgba(235, 86, 86, 0.06);
    border: 1px solid rgb(235, 86, 86);
    font-size: 1.2em;
    font-weight: 600;
    color: rgb(235, 86, 86);
    align-items: center;
}

form input[type="submit"]:hover {
    background-color: rgb(235, 86, 86);
    color: #fff;
}

form #modal {
    background-color: rgb(235, 86, 86);
    width: 370px;
    border: 1px solid rgb(235, 86, 86);
    border-radius: 3px;
    font-size: 1.4em;
    color: #fff;
    line-height: 80px;
    position: absolute;
    top: 200px;
    left: -30px;
}

div button {
    width: 50px;
    height: 24px;
    align-items: center;
    padding: 3px;
    border-radius: 3px;
    margin: 0 0 0 142px;
    background-color: #fff;
    border: 1px solid rgb(235, 86, 86);
    color: rgb(235, 86, 86);
    font-weight: 600;
    position: absolute;
    top: 65px;
}
</style>