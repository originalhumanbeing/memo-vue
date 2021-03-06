<template>
    <div class="wrapper">
        <Auth :onLoginSuccess="this.onLoginSuccess" :onLogoutSuccess="this.onLogoutSuccess"></Auth>
        <div class="notepad">
            <ul class="menu">
                <li>
                    <button class="writeBtn" v-on:click="createMemo">새 메모</button>
                </li>
                <li>
                    <button class="saveBtn" v-on:click="saveMemo">저장</button>
                </li>
                <li>
                    <button class="deleteBtn" v-on:click="deleteMemo">삭제</button>
                </li>
            </ul>
            <ul class="list">
                <li v-for="item in list" v-on:click="showMemo" :key="item.id"
                    v-bind:id="item.id" v-bind:class="{ clicked: memo.currentFile == item.id }">
                    <div v-bind:class="{ clicked: memo.currentFile == item.id }">{{ item.title }}</div>
                    <div v-bind:class="{ clicked: memo.currentFile == item.id }">{{ item.updatedAt }}</div>
                </li>
            </ul>
            <textarea class="memo" name="memo" id="memo" cols="30" rows="10" placeholder="새 메모를 작성하세요!"
                      ref="memo"
                      v-model="memo.content"
                      v-on:keyup="findCursor"></textarea>
        </div>
    </div>
</template>

<script>
    import Auth from './Auth';
    import restService from '../services/restService';

    export default {
        name: 'Notepad',
        components: {
            Auth
        },
        data() {
            return {
                user: {
                    nickname: '',
                    token: ''
                },
                memo: {
                    content: '',
                    cursorStart: 0,
                    cursorEnd: 0,
                    currentFile: ''
                },
                list: []
            }
        },
        updated() {
            // TODO: update될 때마다 save memo
        },
        methods: {
            onLoginSuccess(loginData) {
                this.user.nickname = loginData.nickname;
                this.user.token = loginData.token;

                restService.initMemo(this.user.token, this.user.nickname).then(res => res.json()).then(data => {
                    if (!data['lastWork']) {
                        this.memo.currentFile = '';
                        this.memo.content = '';
                    } else {
                        this.memo.currentFile = data['lastWork'].id;
                        this.memo.content = data['lastWork'].content;
                        this.memo.cursorStart = data['lastWork'].cursorStart;
                        this.memo.cursorEnd = data['lastWork'].cursorEnd;
                    }

                    this.$refs.memo.setSelectionRange(this.memo.cursorStart, this.memo.cursorEnd);
                    this.$refs.memo.focus();
                    this.showList();
                })
            },
            onLogoutSuccess() {
                this.memo.content = '';
                this.memo.currentFile = '';
                this.list = [];
                this.user.nickname = "";
                this.user.token = "";
            },
            showList() {
                restService.fetchMemos(this.user.token, this.user.nickname).then((res) => res.json()).then((data) => {
                    if (!data.memos || data.memos.length === 0) return this.list = [];

                    let memos = data.memos;
                    memos.sort((left, right) => {
                        return right['updatedAt'].localeCompare(left['updatedAt']);
                    });
                    this.list = memos;
                })
            },
            showMemo(e) {
                if (e.target.nodeName == 'LI') {
                    this.memo.currentFile = e.target.id;
                }
                this.memo.currentFile = e.target.parentNode.id;
                restService.fetchMemo(this.user.token, this.user.nickname, this.memo.currentFile).then((res) => res.json()).then((data) => {
                    this.memo.content = data['body'].content;
                    this.memo.cursorStart = data['body'].cursorStart;
                    this.memo.cursorEnd = data['body'].cursorEnd;
                    this.$refs.memo.setSelectionRange(this.memo.cursorStart, this.memo.cursor);
                    this.$refs.memo.focus();
                })
            },
            createMemo() {
                this.memo.currentFile = '';
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
                restService.saveMemo(this.user.token, this.user.nickname, this.memo.currentFile, this.memo.content, this.memo.cursorStart, this.memo.cursorEnd).then(res => res.json()).then(data => {
                    this.memo.currentFile = data.body.id;
                    this.memo.content = data.body.content;
                    this.showList();
                })
            },
            deleteMemo() {
                restService.deleteMemo(this.user.token, this.user.nickname, this.memo.currentFile).then(res => res.json()).then(data => {
                    window.alert(data.body);
                }).then(() => {
                    this.memo.currentFile = '';
                    this.memo.content = '';
                    this.showList();
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
        color: rgb(235, 86, 86);
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
        background-color: rgb(235, 86, 86);
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
</style>
