/* initial chat loader */
document.getElementById('startChatWithOperator').onclick = function() {
    let appendLoader = '';
    appendLoader += '<div id="loading-section">';
    appendLoader += '<img src="assets/img/loader.gif" alt="Loading..." />';
    appendLoader += '<p class="text-center">Connecting  you to a representative...</p>';
    appendLoader += '</div>';
    document.getElementById('preload').innerHTML = appendLoader;
    setTimeout(() => {
        document.getElementById("preload").classList.add("hide");
        document.getElementById("start-chat").classList.remove("hide");
    }, 2500);
}
/* initiated questions array */
const questions = [{
    question: "Please select the year of your car.",
    options: ["2024", "2023", "2022", "2021", "2020", "2019"],
    type: "select"
},
{
    question: "Which insurance company are you with?",
    options: ["Company A", "Company B", "Company C", "Company D"],
    type: "select"
},
{
    question: "What is your car model?",
    options: ["Model X", "Model Y", "Model Z"],
    type: "select"
},
{
    question: "What is your car make?",
    options: ["Make A", "Make B", "Make C"],
    type: "radio"
},
{
    question: "What is your first and last name?",
    type: "text"
},
{
    question: "What is your contact number?",
    type: "tel"
},
{
    question: "What is your email address?",
    type: "email"
}
];

let questionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    $(".chat-box").mCustomScrollbar({
        scrollInertia: 10 // Adjust this value to control the scroll speed
    });
    showLoadingMessage();
    setTimeout(() => {
        displayMessage(questions[questionIndex].question, "bot", () => {
            createInputElement(questions[questionIndex]);
        });
        $(".chat-box").mCustomScrollbar("scrollTo", "bottom", {
            scrollInertia: 10, // Scroll speed (0 for instant scrolling)        
        });
    }, 1000);
});

/* chat user/bot structure  */
function sendMessage(selectedOption) {
    hideInputContainer();
    displayMessage(selectedOption, "user", () => {
        questionIndex++;
        if (questionIndex < questions.length) {
            setTimeout(() => {
                showLoadingMessage();
                setTimeout(() => {
                    displayMessage(questions[questionIndex].question, "bot", () => {
                        createInputElement(questions[questionIndex]);
                    });
                }, 1000);
            }, 500);
        } else {
            setTimeout(() => {
                document.getElementById("input-container").innerHTML = "";
                document.getElementById("submit-button").style.display = "block";
            }, 500);
        }
    });
}

/* display message and add classes  */
function displayMessage(message, sender, callback) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(sender === "bot" ? "bot-message" : "user-message");

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("timestamp");
    timeStamp.innerText = new Date().toLocaleTimeString();

    if (sender === "bot") {
        messageElement.innerHTML = '<figure class="avatar"><img src="assets/img/user.webp" /></figure><span></span>';
        chatBox.appendChild(messageElement);
        messageElement.appendChild(timeStamp);
        typeWriterEffect(messageElement.querySelector("span"), message, () => {
            if (callback) callback();
        });
    } else {
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        messageElement.appendChild(timeStamp);
        if (callback) callback();
    }

    /* Remove the previous loading message, if any */
    const loadingMessages = chatBox.querySelectorAll('.loading');
    loadingMessages.forEach(loadingMessage => chatBox.removeChild(loadingMessage));

    $(".chat-box").mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 10, // Scroll speed (0 for instant scrolling)        
    });
}

/* bot message type effect */
function typeWriterEffect(element, text, callback) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50); /* Adjust the typing speed here (50 ms) */
        } else {
            if (callback) {
                showInputContainer();
                callback();
            }
        }
    }
    type();
}

/* bot msg loading chat box */
function showLoadingMessage() {
    const chatBox = document.getElementById("chat-box");
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("message", "loading", "new");
    loadingMessage.innerHTML = '<figure class="avatar"><img src="assets/img/user.webp" /></figure><span></span>';
    chatBox.appendChild(loadingMessage);
    $(".chat-box").mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 10, // Scroll speed (0 for instant scrolling)        
    });
}

/* create input question as per type */
function createInputElement(question) {
    const inputContainer = document.getElementById("input-container");
    inputContainer.innerHTML = "";

    if (question.type === "select") {
        createSelectOptions(question.options);
    } else if (question.type === "radio") {
        createRadioOptions(question.options);
    } else if (question.type === "text" || question.type === "tel" || question.type === "email") {
        createTextInput(question.type);
    }
    $(".chat-box").mCustomScrollbar("scrollTo", "bottom", {
        scrollInertia: 10, // Scroll speed (0 for instant scrolling)        
    });
}

/* create dropdown menu/select and append the question in chat */
function createSelectOptions(options) {
    const selectElement = document.createElement("select");
    selectElement.id = "user-select";
    /*Append Please Select as first option*/
    const defaultOptionElement = document.createElement("option");
    defaultOptionElement.value = '';
    defaultOptionElement.innerText = 'Please Select';
    defaultOptionElement.setAttribute('disabled', '');
    defaultOptionElement.setAttribute('selected', '');
    defaultOptionElement.setAttribute('hidden', '');
    selectElement.appendChild(defaultOptionElement);

    /*options value and text set in select option*/
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.innerText = option;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", () => {
        sendMessage(selectElement.value);
    });
    document.getElementById("input-container").appendChild(selectElement);
    $(selectElement).select2().on('select2:select', function (e) {
        sendMessage(e.params.data.id);
    });
}

/* create input type radio and append the question in chat */
function createRadioOptions(options) {
    const radioContainer = document.createElement("div");
    radioContainer.classList.add("radio-container");

    options.forEach(option => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "user-radio";
        radio.value = option;
        radio.addEventListener("change", () => {
            sendMessage(option);
        });
        label.appendChild(radio);
        label.appendChild(document.createTextNode(option));
        radioContainer.appendChild(label);
    });

    document.getElementById("input-container").appendChild(radioContainer);
}

/* create input text/email/tel placeholder, type and append the question in chat */
function createTextInput(type) {
    
    console.log(type);

    const inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.id = "user-input";
    if(type == 'text')
        inputElement.placeholder = "Your first and last name";        
    else if(type == 'email')
        inputElement.placeholder = "ex: email@outlook.com";
    else if(type == 'tel') {
        inputElement.setAttribute('maxlength', 10);
        inputElement.placeholder = "(999) 999-9999";    
    } else
        inputElement.placeholder = "Type your answer here...";
    
    inputElement.addEventListener("change", () => {
        if (validateInput(inputElement.value, type)) {
            sendMessage(inputElement.value);
        }
    });
    document.getElementById("input-container").appendChild(inputElement);
    inputElement.focus();    
}

/* validate function to check the user response is valid or not */
function validateInput(input, type) {
    let isValid = true;
    let errorMessage = "";

    switch (type) {
        case "text":
            var textPattern = /^[a-z ,.'-]+$/i;                
            if (input.trim() === "") {
                isValid = false;
                errorMessage = "Name cannot be empty.";
            } else if(!input.match(textPattern)) {
                isValid = false;
                errorMessage = "Invalid Name!! Characters can be used only.";
            }
            break;
        case "tel":
            /* Remove all non-digit characters from the input */
            phoneNumber = input.replace(/\D/g, "");
            
            /* Check if the phone number is exactly 10 digits */
            if (phoneNumber.length !== 10) {
                isValid = false;
                errorMessage = "Please enter a valid 10-digit contact number.";
            }

            break;
        case "email":
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input)) {
                isValid = false;
                errorMessage = "Please enter a valid email address.";
            }
            break;
        default:
            if (input.trim() === "") {
                isValid = false;
                errorMessage = "This field cannot be empty.";
            }
            break;
    }

    if (!isValid) {
        displayMessage(errorMessage, "bot");
    }
    
    return isValid;
}

/* hide div with id "input-container" */
function hideInputContainer() {
    const inputContainer = document.getElementById("input-container");
    inputContainer.style.display = "none";
}

/* show div with id "input-container" */
function showInputContainer() {
    const inputContainer = document.getElementById("input-container");
    inputContainer.style.display = "block";
}

/* submit the inputs loader and success msg */
function submitForm() {
    document.getElementById("submit-button").style.display = "none";
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = '<div id="loading-section"><img src="assets/img/loader.gif" alt="Loading..." /><p class="text-center">Submitting. Please wait...</p></div>';
    setTimeout(() => {
        chatBox.innerHTML = '<div class="success-style"><figure class="avatar"><img src="assets/img/business.png" /></figure><h3>Thanks for reaching out!</h3><p>we will contact you soon.</p></div>';
        document.getElementById("input-container").style.display = "none";        
    }, 2500);
}