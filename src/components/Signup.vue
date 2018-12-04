<template>
    <form method="post">
        <div v-if="signupMsgShow">{{ signupMsg }}</div>
        <fieldset>
            <legend>Sign up</legend>
                <div>NICKNAME</div><input type="text" name="nickname" placeholder="What should we call you?" v-model="nickname">
                <div>EMAIL</div><input type="text" name="email" placeholder="Enter your email address" v-model="email">
                <div>PASSWORD</div><input type="password" name="pwd" placeholder="Enter your password" v-model="pwd">
                <div>PASSWORD AGAIN</div><input type="password" name="checkpwd" placeholder="Enter your password once more" v-model="checkpwd">
                <input type="submit" value="Sign me up!" v-on:click="signup">
        </fieldset>
    </form>
</template>

<script>
export default {
    name: 'Signup',
    data() {
        return {
            nickname: '',
            email: '',
            pwd: '',
            checkpwd: '',
            signupMsg: '',
            signupMsgShow: false
        }
    },
    methods: {
        signup(e) {
            e.preventDefault();
            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch(`http://localhost:8080/signup`, {
                method: 'post',
                headers: myHeaders,
                body: JSON.stringify({ nickname: this.nickname, email: this.email, pwd: this.pwd, checkpwd: this.checkpwd })
            }).then(res => res.json()).then(data => {
                if (!data.success) {
                    this.signupMsg = data.body;
                    this.signupMsgShow = true;
                    return;
                }

                window.alert(data.body);
            })
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
}

form * {
    width: 310px; 
    display: flex; 
    flex-direction: column; 
    max-width: 100%;
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
    line-hegiht: 16px;
    color: rgba(55, 53, 47, 0.8);
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
    border: 1px solid rgba(235, 86, 86);
    font-size: 1.2em;
    font-weight: 600;
    color: rgba(235, 86, 86);
    align-items: center;
}
</style>