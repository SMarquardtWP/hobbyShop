'use strict'

const BASE_URL = "DUMMY";

function baseCall(url, mthd, successCallback, errorCallback, auth, body) {
    //sets up settings for call
    let settings = {
        method: mthd,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (body) {
        settings.body = JSON.stringify(body);
    }
    if (auth) {
        let token = localStorage.getItem('hobbyToken');
        settings.headers.Authorization = 'Bearer ' + token;
    }

    //makes fetch call
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => successCallback(responseJson))
        .catch(err => {
            errorCallback(err);
        });
}

function errorLogin(err) {
    console.log(err);
}

function successLogin(responseJSON) {
    $(".loginResponse").html(`You have logged in successfully`);
    localStorage.setItem('hobbyToken', responseJSON.authToken);
    localStorage.setItem('hobbyName', responseJSON.username);
    location.reload();
}

function watchLogin() {
    $('.login').on('submit', function (event) {
        event.preventDefault();
        let user = $('#username').val();
        let pass = $('#password').val();
        let url = './auth/login';

        console.log("username =" + user);

        let bodySettings = {
            username: user,
            password: pass
        }

        console.log(bodySettings);

        baseCall(url, 'POST', successLogin, errorLogin, false, bodySettings);
    });
}

function watchLogout() {
    $('.login').on('click', '.logout', function (event) {
        event.preventDefault();
        localStorage.removeItem('hobbyToken');
        localStorage.removeItem('hobbyName');
        location.reload();
    });
}

function initHobby() {
    watchLogin();
    watchLogout();
    let logged = localStorage.getItem('hobbyName');
    if (logged != null) {
        $('.userGreet').html(`<p>Welcome, ${logged}!</p><p class='logout'>(Log Out)</p>`);
    }
}

initHobby();