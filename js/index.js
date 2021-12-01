const nameInput = document.querySelector('.spaceholder1');
const submitButton = document.querySelector('.submit_button');
const saveButton = document.querySelector('.save_button');
const clearButton = document.querySelector('.clear_button');
const gender = document.querySelector('.gender_content');
const probability = document.querySelector('.probability_content');
const maleCheckbox = document.getElementById('male_checkbox');
const femaleCheckbox = document.getElementById('female_checkbox');

// get user data from API and return the json value.
async function getUserData(username) {
    console.log("request");
    try {
        let response = await fetch(`https://api.genderize.io/?name=${username}`)
        let json = await response.json();
        if (response.status == 200) {
            return json
        }
        handleError(json);
        return Promise.reject(`Request failed with error ${response.status}`);
    } catch (e) {
        showErrorMessage(e);
        console.log(e);
    }
}

// set gender of a name
function setGender(userData) {
    if (userData.gender == null)
        gender.innerHTML = `Sorry!!!`;
    else
        gender.innerHTML = userData.gender;
}

// set probability of a gender prediction
function setProbability(userData) {
    if (userData.probability == null)
        probability.innerHTML = `Sorry!!!`;
    else
        probability.innerHTML = userData.probability;
}

// fill user data in view .
function extract_gender(userData) {
    console.log(userData);
    setGender(userData);
    setProbability(userData);
}

// save user information
function saveGender() {
    username = nameInput.value
    var gender = null
    if (maleCheckbox.checked) {
        gender = maleCheckbox.value
    }else{
        gender = femaleCheckbox.value
    }   
    console.log(gender) 
    var prob = 100

    content_to_save = {
        "name": username, 
        "gender": gender, 
        "probability": prob
    }
    window.localStorage.setItem(username, JSON.stringify(content_to_save));
}

function display_saved_content(saved_userData){
    // ye block jadid dorost kon
}
// clear saved username
async function clearHistory(e){
    let username = nameInput.value;

    e.preventDefault();
    let userData;
    userData = await JSON.parse(window.localStorage.getItem(username));
    if (userData != null) {
        window.localStorage.removeItem(username);
    }
    else{
        console.log('we didnt have it :(')
    }
}

// the process of sending data and fill it in view.
async function sendRequest(e) {
    console.log("clicked on submit");
    let username = nameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    e.preventDefault();
    let userData;
    saved_userData = await JSON.parse(window.localStorage.getItem(username));
    userData = await getUserData(username);
    if (saved_userData != null) {
        display_saved_content(saved_userData);
    }
    if (userData == null)
        return;
    extract_gender(userData);
}

submitButton.addEventListener('click', sendRequest);
saveButton.addEventListener('click', saveGender);
clearButton.addEventListener('click', clearHistory);

window.localStorage.clear();