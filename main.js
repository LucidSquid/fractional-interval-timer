const button = document.querySelector("button");
const timer = document.querySelector(".timer");
let timerActive = false;
let timerInterval = 5;
let rewardsInterval = 6.25;
let timerValue;
let start;
let loopCount;

loadSavedInterval();
setTimerText(timerInterval);

timer.addEventListener("click", () => {
    let input = prompt("Enter a timer value: ");

    if (Number.isNaN(+input))
        alert(input + " is not a valid input.");
    else if (input === null || input === "")
    {}
    else if (input <= 0)
        alert("Value must be greater than 0.");
    else if (input > 1_000_000)
        alert(input + " is too large. Max value is 1,000,000.");
    else {
        setTimerInterval(+input);
        initializeTimerVars();
    }
    
    setTimerText(timerInterval);
});

button.addEventListener("click", () => {
    button.classList.toggle("active");

    setTimerActive();

    if (timerActive) {
        button.innerHTML = "Stop<kbd>Space</kbd";
        initializeTimerVars();
    }
        
    else
        button.innerHTML = "Start<kbd>Space</kbd";
});

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        button.blur();
        button.click();
    }

    if (event.code === "KeyM") {
        setTimerInterval(rewardsInterval);
        initializeTimerVars();
        setTimerText(timerInterval);
    }
});

function setTimerInterval(value) {
    timerInterval = value;
    localStorage.setItem("savedInterval", value);
}

function loadSavedInterval() {
    if (localStorage.getItem("savedInterval"))
        setTimerInterval(+localStorage.getItem("savedInterval"));
}

function setTimerText(value) {
    timer.textContent = value.toFixed(3);
}

function setTimerActive() {
    if (button.classList.contains("active"))
        timerActive = true;
    else
        timerActive = false;
}

function initializeTimerVars() {
    start = new Date().getTime();
    timerValue = timerInterval;
    loopCount = 0;
}

function getLoopCount(timeElapsed) {
    return Math.floor(timeElapsed / timerInterval);
}

setInterval(function() {
    if (timerActive) {
        let now = new Date().getTime();
        let timeElapsed = (now - start) / 1000;

        timerValue = timerInterval - (timeElapsed % timerInterval);
        
        let currentLoopCount = getLoopCount(timeElapsed);

        if (loopCount < currentLoopCount) {
            loopCount = currentLoopCount;
            console.log("Times looped: " + loopCount);
        }

        setTimerText(timerValue);
    }
}, 8);

function resetTimer() {

}