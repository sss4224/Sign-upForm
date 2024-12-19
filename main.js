

const usernameEl = document.getElementById('username');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById('password');
const repeatPasswordEl = document.getElementById('repeatPassword');
const passwordErrorEl = document.querySelector('.passwordMatching');
const btnEl = document.querySelector('button');
const formEl = document.querySelector('form');
const newsletterCheckboxEl = document.getElementById('newsletterCheckbox');
const newsletterInfoEl = document.querySelector('.newsletter');

const signedUpMessageEl = document.querySelector('.signedUpContainer');
const messageEl = document.querySelector('.message');
const closeBtn = document.getElementById('closeBtn');


//Kjører når man trykker submit
formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const isValid = validatePassword();
    if(!isValid){
        messageEl.textContent = 'Your password was not matching';
        toggleWrongPassword(true);
        return togglePopup(false);
    }

    const isDuplicate = await checkForDup();
    if(isDuplicate) return;

    signUpForm();
})

//Kjører hver gang det kommer et input
repeatPasswordEl.addEventListener('input', () => {
    const isValid = validatePassword();
    if(!isValid && repeatPasswordEl.value.length >= passwordEl.value.length){
        return toggleWrongPassword(true);
    }
    return toggleWrongPassword(false);
})

//Skifter class på input og tekst + skrur av og på submit knapp basert på om passord er innenfor kriteriene
function toggleWrongPassword(isWrong){
    passwordErrorEl.classList.toggle('passwordNotMatching', isWrong);
    repeatPasswordEl.classList.toggle('wrongPassword', isWrong);
    return btnEl.disabled = isWrong;
}

//Skjekker at passord stemmer med repeatPassord
function validatePassword(){
    return passwordEl.value === repeatPasswordEl.value;
}

//Funksjonen som lar deg sende inn til APIen
async function signUpForm(){
    try {
        //Henter ut informasjonen til elementene i formen (Elementene må ha name tag får å fungere)
        const payload = new FormData(formEl);
        //Legger til checkboxen selv om den er off
        if(!newsletterCheckboxEl.checked) payload.append('newsletter', 'off');
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

        //Gjør API dataen til json
        const data = await response.json();
        alreadySignedUp(data.username, true);

    } catch (error) {
        console.log(error.stack);
    }
}

//Skjekker at APIen ikke allerede har eposten inne i systemet
async function checkForDup(){
    try {
        const response = await fetch('https://675aee2c9ce247eb19351651.mockapi.io/API/v1/users');
        if(!response.ok){
            throw new Error('Could not find server');
        }
        
        const data = await response.json();
        
        const userExist = data.some(item => item.email === emailEl.value);
        
        if(userExist){
            alreadySignedUp(emailEl.value, false);
            throw new Error('This user already Exist');
        }
        return false;

    } catch (error) {
        console.log(error.stack);
        return true;
    }
}

//Skjekker om brukeren allerede er logget in
async function alreadySignedUp(username, isUserNew){
    toggleHidden(isUserNew);
    if(isUserNew) checkboxMsg();
    console.log('Already signed up check');
    messageEl.textContent = isUserNew
        ? `${username} is now signed up`
        : `${username} already is signed up`;
        console.log(messageEl.textContent);
    togglePopup(false);
}

//Skrur av og på class basert på om teksten skal vises eller ikke
function toggleHidden(isUserNew){
    newsletterInfoEl.classList.toggle('hidden', !isUserNew);
}

//Bestemer hvilken tekst som skal vises
function checkboxMsg(){
    newsletterInfoEl.textContent = newsletterCheckboxEl.checked
        ? 'You will receive weekly newsletters'
        : 'You will not receive weekly newsletters';
}

//Lukker msgPopupen
closeBtn.onclick = () => {
    toggleWrongPassword(false);
    togglePopup(true);
}

//Skrur av og på class for å vise msgPopupen
function togglePopup(closePopup){
    signedUpMessageEl.classList.toggle('hidden', closePopup);
}