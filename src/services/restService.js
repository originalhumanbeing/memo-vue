const API_HOST = process.env.VUE_APP_API_HOST;

export default {
    login(email, pwd) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        return fetch(`${API_HOST}/login`, {
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify({ id: email, pwd: pwd })
        });
    },

    initMemo(token, nickname) {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        };

        return fetch(`${API_HOST}/initmemo/${nickname}`, {
            method: 'get',
            headers: myHeaders
        })
    },

    signup(nickname, email, pwd, checkpwd) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        return fetch(`${API_HOST}/signup`, {
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify({ nickname, email, pwd, checkpwd })
        })
    },

    fetchMemos(token, nickname) {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        };

        return fetch(`${API_HOST}/memos/${nickname}`, {
            method: 'get',
            headers: myHeaders
        })
    },

    fetchMemo(token, nickname, currentFile) {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        };

        return fetch(`${API_HOST}/memo/${nickname}/${currentFile}`, {
            method: 'get',
            headers: myHeaders
        })
    },

    saveMemo(token, nickname, currentFile, content, cursorStart, cursorEnd) {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        };

        return fetch(`${API_HOST}/memo/${nickname}`, {
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify({
                memoId: currentFile,
                memo: content,
                user: nickname,
                cursorStart: cursorStart,
                cursorEnd: cursorEnd
            })
        })
    },

    deleteMemo(token, nickname, currentFile) {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        };

        return fetch(`${API_HOST}/memo/${nickname}/${currentFile}`, {
            method: 'delete',
            headers: myHeaders
        })
    }
}