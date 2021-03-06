const nameInput = document.querySelector('.name_holder');
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
        // gender.innerHTML = 'An error occurred while sending request'
        console.log(e);
    }
}

// set gender of a name
function setGender(userData, gender_obj) {
    if (userData.gender == null){
        alert(`Sorry, we don't have this name in our database.`)
        gender_obj.innerHTML = `Sorry, we don't have this name in our database.`;
    }
    else
        gender_obj.innerHTML = userData.gender;
}

// set probability of a gender prediction
function setProbability(userData, prob_obj) {
    if (userData.probability == null){
        prob_obj.innerHTML = '';
    }
    else
        prob_obj.innerHTML = userData.probability;
}

// fill user data in view .
function extract_gender(userData,) {
    console.log(userData);
    setGender(userData, gender);
    setProbability(userData, probability);
}

// save user's information
async function saveGender() {
    username = nameInput.value
    var gender = null
    if (maleCheckbox.checked) {
        gender = maleCheckbox.value
        maleCheckbox.checked = false;
        var prob = 100
    }else if (femaleCheckbox.checked){
        gender = femaleCheckbox.value
        femaleCheckbox.checked = false;
        var prob = 100
    }else {
        userData = await getUserData(username);
        window.localStorage.setItem(username, JSON.stringify(userData));
        return;
    }
    console.log(gender) 

    content_to_save = {
        "name": username, 
        "gender": gender, 
        "probability": prob
    }
    window.localStorage.setItem(username, JSON.stringify(content_to_save));
    display_saved_content(content_to_save)
}

// display saved gender
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
        savedGender.innerHTML = '';
        savedProbability.innerHTML = '';
    }
    else{
        console.log('we didnt have it :(')
    }
}

// check input format
function checkInputFormat(name) {
    let standard = /^[a-z A-Z]+$/;
    return standard.test(name);
}

// the process of sending request and display data in webpage.
async function showGender(e) {
    console.log("clicked on submit");
    let username = nameInput.value;
    if (username == "" || checkInputFormat(username) != true) {
        console.log("name is null or in a wrong format");
        alert("name is null or in a wrong format\n(you should only use english letters and spaces)")
        gender.innerHTML = "name is null or in a wrong format\n (you should only use english letters and spaces)"
        probability.innerHTML = ""
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

// actions
submitButton.addEventListener('click', showGender);
saveButton.addEventListener('click', saveGender);
clearButton.addEventListener('click', clearHistory);

window.localStorage.clear();