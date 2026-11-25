console.log("Hello world");
const redLight = document.getElementById("red");
const yellowLight = document.getElementById("yellow");
const greenLight = document.getElementById("green");
const statusText = document.getElementById("status");

let autoInterval = null;
let currentStep = 0;


function turnOffAll() {
    redLight.classList.remove("active");
    yellowLight.classList.remove("active");
    greenLight.classList.remove("active");
}


function setLight(color, isAuto = false) {
    
    if (!isAuto && autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }

    turnOffAll();

    if (color === "red") {
        redLight.classList.add("active");
        statusText.textContent = "TO'XTANG! (Qizil)";
        statusText.style.color = "#ef4444";
    } else if (color === "yellow") {
        yellowLight.classList.add("active");
        statusText.textContent = "TAYYORLANING! (Sariq)";
        statusText.style.color = "#eab308";
    } else if (color === "green") {
        greenLight.classList.add("active");
        statusText.textContent = "HARAKATLANING! (Yashil)";
        statusText.style.color = "#22c55e";
    }
}


function startAuto() {
    if (autoInterval) return; 
    const sequence = ["red", "yellow", "green", "yellow"];
    currentStep = 0;
    setLight(sequence[currentStep], true);

    autoInterval = setInterval(() => {
        currentStep = (currentStep + 1) % sequence.length;
        setLight(sequence[currentStep], true);
    }, 2000);
}


startAuto();