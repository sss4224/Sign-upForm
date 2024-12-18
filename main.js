

const usernameEl = document.getElementById('username');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const repeatPasswordEl = document.getElementById('repeatPassword');
const btnEl = document.querySelector('button');
const formEl = document.querySelector('form');
const newsletterCheckboxEl = document.getElementById('newsletterCheckbox');

const signedUpMessageEl = document.querySelector('.signedUpContainer');
const messageEl = document.querySelector('.message');
const closeBtn = document.getElementById('closeBtn');



formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isValid = validatePassword();
    if(!isValid){
        messageEl.textContent = 'Your password was not matching';
        return togglePopup(false);
    }
    
    const isDuplicate = await checkForDup();
    if(isDuplicate) return;

    signUpForm();
})

function validatePassword(){
    return passwordEl.value === repeatPasswordEl.value;
}

async function signUpForm(){
    try {        
        const payload = new FormData(formEl);
        console.log(...payload);
    
        payload.forEach((value, key) => {
            payload[key] = value;
        })
            
        const response = await fetch('https://675aee2c9ce247eb19351651.mockapi.io/API/v1/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if(!response.ok) throw new Error('Could not find server');

        const data = await response.json();
        alreadySignedUp(data.username, true);

    } catch (error) {
        console.log(error.stack);
    }
}

async function checkForDup(){
    try {
        const response = await fetch('https://675aee2c9ce247eb19351651.mockapi.io/API/v1/users');
        if(!response.ok){
            throw new Error('Could not find server');
        }
        
        const data = await response.json();
        
        const userExist = data.some(item => item.email === emailEl.value);
        
        if(userExist){
            console.log('test1');
            alreadySignedUp(emailEl.value, false);
            throw new Error('This user already Exist');
        }
        return false;

    } catch (error) {
        console.log(error.stack);
        return true;
    }
}

async function alreadySignedUp(username, isUserNew){
    messageEl.textContent = isUserNew
        ? `${username} is now signed up`
        : `${username} already is signed up`;
        console.log(messageEl.textContent);
    togglePopup(false);
}

closeBtn.onclick = () => {
    console.log('Close button pressed');
    togglePopup(true);
}

function togglePopup(closePopup){
    console.log('hidden or not');
    signedUpMessageEl.classList.toggle('hidden', closePopup);
}