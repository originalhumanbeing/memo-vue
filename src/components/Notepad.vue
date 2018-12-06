<template>
    <div class="wrapper">
        <div class="authFailMsg" v-if="user.connectionState.authFailMsgShow">{{ user.connectionState.authFailMsg }}</div>
        <form id="auth" method="post" v-if="user.connectionState.beforeLogin">
            <input type="text" id="id" name="id" placeholder="email@email.com" v-model="user.id">
            <input type="password" id="pwd" name="pwd" placeholder="password" v-model="user.pwd">
            <input type="submit" id="loginBtn" value="Log in" v-on:click="login">
            <router-link to="/signup">Sign Up</router-link>
        </form>
        <div id="userNav" v-if="!user.connectionState.beforeLogin">
            <p id="userNickname" v-if="!user.connectionState.beforeLogin"> {{ user.nickname + ' 님' }}</p>
            <button id="logoutBtn" v-on:click="logout">Log out</button>
        </div>
        <div class="notepad">
            <ul class="menu">
                <li><button class="writeBtn" v-on:click="createMemo">새 메모</button></li>
                <li><button class="saveBtn" v-on:click="saveMemo">저장</button></li>
                <li><button class="updateBtn" v-on:click="updateMemo">수정 완료</button></li>
                <li><button class="deleteBtn" v-on:click="deleteMemo">삭제</button></li>
            </ul>
            <ul class="list">
                <li  v-for="item in list" v-on:click="showMemo" v-bind:class="{ clicked: user.currentFile === item }">{{ item }}</li>
            </ul>
            <textarea class="memo" name="memo" id="memo" cols="30" rows="10" placeholder="새 메모를 작성하세요!"
                      ref="memo"
                      v-model="memo.content"
                      v-on:keyup="findCursor"></textarea>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Notepad',
    props: {
        msg: String
    },
    data() {
        return {
            user: {
                connectionState: {
                    beforeLogin: true,
                    authFailMsg: '',
                    authFailMsgShow: false
                },
                id: '',
                nickname: '',
                pwd: '',
                token: '',
                currentFile: ''
            },
            memo: {
                content: '',
                cursorStart: 0,
                cursorEnd: 0
            },
            list: []
        }
    },
    // mounted() {
    //     this.$bus.$on('login', this.login);
    // },
    methods: {
        login(e) {
            e.preventDefault();
            // console.log('event 로 실행되었어!');

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch(`http://localhost:8080/login`, {
                method: 'post',
                headers: myHeaders,
                body: JSON.stringify({id: this.user.id, pwd: this.user.pwd})
            }).then((res) => res.json()).then((data) => {
                if (!data['body'] || !data['body'].isLogin) {
                    this.user.connectionState.authFailMsgShow = true;
                    this.user.connectionState.authFailMsg = data['body'];
                    return;
                }

                if (!data['lastwork']) {
                    this.user.currentFile = '';
                    this.memo.content = '';
                } else {
                    this.user.currentFile = data['lastwork'].title;
                    this.memo.content = data['lastwork'].content;
                    this.memo.cursorStart = data['lastwork'].cursorStart;
                    this.memo.cursorEnd = data['lastwork'].cursorEnd; 
                }

                this.$refs.memo.setSelectionRange(this.memo.cursorStart, this.memo.cursorEnd);
                this.$refs.memo.focus();
                this.user.nickname = data['body'].nickname;
                this.user.token = data['encodedToken'];
                this.showList();
                this.user.connectionState.authFailMsgShow = false;
                this.user.connectionState.beforeLogin = false;
            })
        },
        logout() {
            this.user.id = '';
            this.user.pwd = '';
            this.user.nickname = '';
            this.user.connectionState.beforeLogin = true;
            this.user.currentFile = '';
            this.memo.content = '';
        },
        showList() {
            fetch(`http://localhost:8080/memos/${this.user.nickname}`, {
                method: 'get'
            }).then((res) => res.json()).then((data) => {
                if (!data['body'] || data['body'].length === 0) return;

                data['body'].sort((a, b) => a - b);
                this.list = data['body'];
            })
        },
        showMemo(e) {
            this.user.currentFile = e.target.innerText;
            fetch(`http://localhost:8080/memo/${this.user.nickname}/${this.user.currentFile}`, {
                method: 'get'
            }).then((res) => res.json()).then((data) => {
                this.memo.content = data['body'].content;
                this.memo.cursorStart = data['body'].cursorStart;
                this.memo.cursorEnd = data['body'].cursorEnd;
                this.$refs.memo.setSelectionRange(this.memo.cursorStart, this.memo.cursor);
                this.$refs.memo.focus();
            })
        },
        createMemo() {
            this.memo.content = '';
            this.memo.cursorStart = '';
            this.memo.cursorEnd = '';
            this.$refs.memo.focus();
        },
        findCursor(e) {
            this.memo.cursorStart = e.target.selectionStart;
            this.memo.cursorEnd = e.target.selectionEnd;
        },
        saveMemo() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch(`http://localhost:8080/memo/${this.user.nickname}`, {
                method: 'post',
                headers: myHeaders,
                body: JSON.stringify({
                    memo: this.memo.content,
                    user: this.user.nickname,
                    cursorStart: this.memo.cursorStart,
                    cursorEnd: this.memo.cursorEnd
                })
            }).then(res => res.json()).then(data => {
                this.user.currentFile = data.body.title;
                this.memo.content = data.body.content;
                this.showList();
            })
        },
        updateMemo() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            fetch(`http://localhost:8080/memo/${this.user.nickname}/${this.user.currentFile}`, {
                method: 'put',
                headers: myHeaders,
                body: JSON.stringify({
                    memo: this.memo.content,
                    user: this.user.nickname,
                    cursorStart: this.memo.cursorStart,
                    cursorEnd: this.memo.cursorEnd
                })
            }).then(res => res.json()).then(data => {
                this.user.currentFile = data.body.title;
                this.memo.content = data.body.content;
                this.showList();
            })
        },
        deleteMemo() {
            fetch(`http://localhost:8080/memo/${this.user.nickname}/${this.user.currentFile}`, {
                method:'delete'
            }).then(res => res.json()).then(data => {
                window.alert(data.body);
            }).then(() => {
                this.showList();
                this.memo.content = '';
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

ul, li {
    list-style: none;
}

.wrapper {
    width: 900px;
    height: 100%;
    margin: 50px auto;
}

.notepad {
    display: flex;
    position: relative;
    width: 900px;
    min-height: 500px;
}

.list {
    position: absolute;
    top: 46px;
    left: 0;
    padding: 8px;
    width: 250px;
    height: 500px;
    background-color: #ffffff;
    border-left: 1px solid silver;
    border-bottom: 1px solid silver;;
    border-bottom-left-radius: 3px;
    overflow: scroll;
}

.list li {
    font-size: 1.1em;
    font-weight: 400;
    border-bottom: 1px solid silver;
    padding: 3px;
    margin: 3px;
}

.list .clicked {
    font-weight: 600;
    color: rgba(235, 86, 86);
}

.memo {
    position: absolute;
    top: 46px;
    left: 250px;
    width: 650px;
    min-height: 500px;
    background-color: #ffffff;
    border-top: 0;
    border-right: 1px solid silver;
    border-left: 1px solid silver;
    border-bottom: 1px solid silver;;
    border-bottom-right-radius: 3px;
    padding: 8px;
}

.menu {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 900px;
    padding: 8px 0 8px 8px;
    background-color: rgba(235, 86, 86);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
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

#auth {
    margin: 0 5px 15px 5px;
    border-bottom: 1px solid black;
}

#auth input {
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

#userNav {
    margin: 0 5px 15px 5px;
    border-bottom: 1px solid black;
}

#userNav . {
    padding: 5px 8px;
    margin: 10px 3px;
}

#userNickname {
    display: inline-block;
    margin-left: 15px;
}
</style>
