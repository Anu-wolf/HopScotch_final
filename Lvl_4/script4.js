// Selecting elements from the DOM
const draggableElements = document.querySelectorAll('.draggable');
const droppableElements = document.querySelectorAll('.droppable');
const notification = document.querySelector('.notification');
const overlay = document.querySelector('.overlay');
const instt = document.querySelector('.inst');
const retry_lvl = document.querySelector('.retry_lvl');
const correctCountElement = document.querySelector('.correct-count .count');
const wrongCountElement = document.querySelector('.wrong-count .count');
const energyFillElement = document.querySelector('.energy-fill');
const startButton = document.getElementById('startButton');
const timerElement = document.querySelector('.timer');

// Initializing game variables
let timerCount = 25;
let timerInterval;
overlay.classList.add('show');
const maxCount = 8;
const mincount = 8;
let correctCount = 0;
let wrongCount = 0;

// Array with IDs in ascending order
const expectedOrder = ['eight','seven', 'six','five','four','three','two','one'];

// Event listener to start the game
startButton.addEventListener('click', startGame);

// Function to show instructions before starting the game
function beforestart() {
    overlay.style.display = 'block';
    instt.classList.add('show');
    startButton.style.display = 'block';
}
beforestart();

// Function to start the game
function startGame() {
    // Hide the start button and overlay once the game starts
    overlay.style.display = 'none';
    startButton.style.display = 'none';
    startTimer();
}

// Function to start the game timer
function startTimer() {
    timerInterval = setInterval(() => {
        timerCount--;
        timerElement.textContent = timerCount;
        if (timerCount === 0) {
            clearInterval(timerInterval);
            showRetryNotification();
        }
    }, 1000);
}

// Function to stop the game timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Adding event listeners for draggable elements
draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
});

// Adding event listeners for droppable elements
droppableElements.forEach(elem => {
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("drop", drop);
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragleave", dragLeave);
});

// Function to handle drag start event
function dragStart(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Function to handle drag enter event
function dragEnter(event) {
    event.target.classList.add("droppable-hover");
}

// Function to handle drag leave event
function dragLeave(event) {
    event.target.classList.remove("droppable-hover");
}

// Function to handle drag over event
function dragOver(event) {
    event.preventDefault();
}

// Function to handle drop event
function drop(event) {
    event.preventDefault();
    const draggableElementData = event.dataTransfer.getData("text");
    const droppableElementData = event.target.getAttribute("data-draggable-id");

    // Check if dropped element's ID matches the expected ID in the array
    if (draggableElementData === expectedOrder[correctCount]) {
        if (draggableElementData === droppableElementData) {
            event.target.classList.add("dropped");
            const draggableElement = document.getElementById(draggableElementData);
            event.target.style.backgroundColor = draggableElement.style.backgroundColor;
            draggableElement.classList.add("dragged");
            draggableElement.setAttribute("draggable", "false");
            const newDiv = document.createElement("div");
            newDiv.classList.add("square.draggableElementData");
            event.target.insertBefore(newDiv, event.target.firstChild);
            incrementCorrectCount();
            if (correctCount === mincount) {
                stopTimer();
                showCongratulations();
            }
        } else {
            showNotification_1();
        }
    } else {
        showNotification_2();
    }
}

// Function to show notification for wrong order
function showNotification_2() {
    let wrong = document.createElement("span");
    wrong.classList.add("wrong-notif");
    notification.innerHTML = "";
    wrong.innerHTML = `Oops, that is not in descending order. Please arrange the tiles in descending order.`;
    notification.append(wrong);
    notification.classList.add("show");
    overlay.style.display = "block";
    incrementWrongCount();
    setTimeout(closeDiv, 2000);
}

// Function to show notification for mismatched element
function showNotification_1() {
    let wrong = document.createElement("span");
    wrong.classList.add("wrong-notif");
    notification.innerHTML = "";
    wrong.innerHTML = `Oops, that is not right. Match the number with the correct word in the descending order.`;
    notification.append(wrong);
    notification.classList.add("show");
    overlay.style.display = "block";
    incrementWrongCount();
    setTimeout(closeDiv, 2000);
}

// Function to close the notification div
function closeDiv() {
    notification.classList.remove("show");
    overlay.style.display = "none";
}

// Function to increment correct count
function incrementCorrectCount() {
    correctCount++;
    correctCountElement.textContent = correctCount;
    updateEnergyBar();
}

// Function to increment wrong count
function incrementWrongCount() {
    wrongCount++;
    wrongCountElement.textContent = wrongCount;
    updateEnergyBar();
}

// Function to update the energy bar
function updateEnergyBar() {
    const energyBar = document.querySelector(".energy-fill");
    const fillPercentage = (correctCount / maxCount) * 100;
    energyBar.style.width = `${fillPercentage}%`;
}

// Function to show congratulations message
function showCongratulations() {
    const congratulationsDiv = document.createElement("div");
    congratulationsDiv.classList.add("congratulations");

    const message = document.createElement("div");
    message.textContent = "Congratulations! You have arranged all tiles correctly.";
    congratulationsDiv.appendChild(message);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const replayButton = document.createElement("button");
    replayButton.textContent = "Replay";
    replayButton.classList.add("play-button");
    replayButton.addEventListener("click", retryLevel);
    buttonContainer.appendChild(replayButton);

    const nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.classList.add("play-button");
    nextLevelButton.addEventListener("click", nextLevel);
    buttonContainer.appendChild(nextLevelButton);

    const mainLevelButton = document.createElement("button");
    mainLevelButton.textContent = "Main Page";
    mainLevelButton.classList.add("play-button");
    mainLevelButton.addEventListener("click", mainLevel);
    buttonContainer.appendChild(mainLevelButton);

    congratulationsDiv.appendChild(buttonContainer);
    document.body.appendChild(congratulationsDiv);
}

// Function to proceed to the next level
function nextLevel() {
    window.location.href = "https://rudhraa-r.github.io/HopScotch-/Lvl_qa/index_qa.html";
}

// Function to retry the current level
function retryLevel() {
    window.location.href = "https://rudhraa-r.github.io/HopScotch-/Lvl_4/index4.html";
}

// Function to go to the main page
function mainLevel() {
    window.location.href = "https://rudhraa-r.github.io/HopScotch-/main.html";
}

// Function to show retry notification when time runs out
function showRetryNotification() {
    const retryDiv = document.createElement("div");
    retryDiv.classList.add("Retry");

    overlay.style.display = "block";
    const message = document.createElement("div");
    message.textContent = "Time's up! Please retry to arrange the tiles within 25 seconds.";
    retryDiv.appendChild(message);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const retryLevelButton = document.createElement("button");
    retryLevelButton.textContent = "Retry Level";
    retryLevelButton.classList.add("rb-notif");
    retryLevelButton.addEventListener("click", retryLevel);
    buttonContainer.appendChild(retryLevelButton);

    const mainLevelButton = document.createElement("button");
    mainLevelButton.textContent = "Main Page";
    mainLevelButton.classList.add("play-button");
    mainLevelButton.addEventListener("click", mainLevel);
    buttonContainer.appendChild(mainLevelButton);

    retryDiv.appendChild(buttonContainer);
    retry_lvl.classList.add("show");
    retry_lvl.appendChild(retryDiv);
}
