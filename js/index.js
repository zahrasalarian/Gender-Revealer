const nameInput = document.querySelector('.spaceholder1');
const submitButton = document.querySelector('.submit_button');
const saveButton = document.querySelector('.save_button');
const clearButton = document.querySelector('.clear_button');
const gender = document.querySelector('.gender_content');
const probability = document.querySelector('.probability_content');
const savedGender = document.querySelector('.gender_saved');
const savedProbability = document.querySelector('.probability_saved');
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
function setGender(userData, gender_obj) {
    if (userData.gender == null)
        gender_obj.innerHTML = `Sorry!!!`;
    else
        gender_obj.innerHTML = userData.gender;
}

// set probability of a gender prediction
function setProbability(userData, prob_obj) {
    if (userData.probability == null)
        prob_obj.innerHTML = `Sorry!!!`;
    else
        prob_obj.innerHTML = userData.probability;
}

// fill user data in view .
function extract_gender(userData,) {
    console.log(userData);
    setGender(userData, gender);
    setProbability(userData, probability);
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
    console.log(saved_userData);
    setGender(saved_userData, savedGender);
    setProbability(saved_userData, savedProbability);
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
    }else{
        display_saved_content({'name': '',
                            "gender": '', 
                            "probability": ''});
    }
    if (userData == null)
        return;
    extract_gender(userData);
}

submitButton.addEventListener('click', sendRequest);
saveButton.addEventListener('click', saveGender);
clearButton.addEventListener('click', clearHistory);

window.localStorage.clear();