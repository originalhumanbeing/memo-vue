<template>
    <form method="post">
        <div v-if="signupMsgShow">{{ signupMsg }}</div>
        <fieldset>
            <legend>Sign up</legend>
                NICKNAME <input type="text" name="nickname" placeholder="What should we call you?" v-model="nickname">
                EMAIL <input type="text" name="email" placeholder="Enter your email address" v-model="email">
                PASSWORD <input type="password" name="pwd" placeholder="Enter your password" v-model="pwd">
                PASSWORD AGAIN <input type="password" name="checkpwd" placeholder="Enter your password once more" v-model="checkpwd">
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
                }

                window.alert(data.body);
            })
        }
    }
}  
</script>

<style scoped>
</style>