// import axios from './axios/dist/axios';
const signupform = document.getElementById('signupform');
const loginform = document.getElementById('loginform');
const container = document.querySelector('.container');
const signup = document.querySelector('.signup-text');
const signin = document.querySelector('.signin-text');

signupform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupusername').value;
    const password = document.getElementById('signuppassword').value;
    const data = {
        username:  `${username}`,
        password:  `${password}`
    };
    try{
        const response = await axios({
            url: '/api/user/register',
            method: 'POST',
            data: {
                username: `${username}`,
                password:  `${password}`
            }
        });
        sessionStorage.setItem("accessToken", response.data);
        signupform.submit();
        return response.data;
    }catch(error){
        // Print Username is not found or Password is wrong 
        console.log(error.response.data);
    }
})

loginform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signinusername').value;
    const password = document.getElementById('signinpassword').value;
    const data = {
        username:  `${username}`,
        password:  `${password}`
    };
    try{
        const response = await axios({
            url: '/api/user/login',
            method: 'POST',
            data: {
                username: `${username}`,
                password:  `${password}`
            }
        });
        // console.log(response.data);
        sessionStorage.setItem("auth-token", response.data);
        loginform.submit();
        return response.data;
    }catch(error){
        // Print Username is not found or Password is wrong 
        console.log(error);
        console.log(error.response.data);
    }
})

signup.addEventListener('click', ()=>{
    document.getElementById('signinusername').value = '';
    document.getElementById('signinpassword').value = '';
    container.classList.add("active");
})

signin.addEventListener('click', ()=>{
    document.getElementById('signupusername').value = '';
    document.getElementById('signuppassword').value = '';
    container.classList.remove("active");
})
