const button = document.querySelector("button");
const timer = document.querySelector(".timer");
let timerActive = false;
let timerInterval = 5;

setIntervalText();



timer.addEventListener("click", () => {
    let input = prompt("Enter a timer value: ");

    if (Number.isNaN(+input))
        alert(input + " is not a number.");
    else if (input === null || input === "")
    {}
    else
        timerInterval = +input;
    
    setIntervalText();
});

button.addEventListener("click", () => {
    button.classList.toggle("active");

    setTimerActive();

    if (timerActive)
        button.innerHTML = "Stop<kbd>Space</kbd";
    else
        button.innerHTML = "Start<kbd>Space</kbd";
});

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        button.blur();
        button.click();
    }
});

function setIntervalText() {
    timer.textContent = timerInterval.toFixed(3);
}

function setTimerActive() {
    if (button.classList.contains("active"))
        timerActive = true;
    else
        timerActive = false;
}