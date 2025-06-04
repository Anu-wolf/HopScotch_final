// Select elements from the DOM and assign them to constants
const draggableElements = document.querySelectorAll('.draggable');
const droppableElements = document.querySelectorAll('.droppable');
const notification = document.querySelector('.notification');
const overlay = document.querySelector('.overlay');
const correctCountElement = document.querySelector('.correct-count .count');
const wrongCountElement = document.querySelector('.wrong-count .count');
const energyFillElement = document.querySelector('.energy-fill');
const instt = document.querySelector('.inst');
const retry_lvl = document.querySelector('.retry_lvl');
const startButton = document.getElementById('startButton');
const timerElement = document.querySelector('.timer');

// Initialize timer and game counters
let timerCount = 25;
let timerInterval;
const maxCount = 8;
let correctCount = 0;
let wrongCount = 0;

// Show the overlay and start button before the game starts
overlay.classList.add('show');
startButton.addEventListener('click', startGame);

function beforestart() {
    overlay.style.display = 'block';
    instt.classList.add('show');
    startButton.style.display = 'block';
}

beforestart();

function startGame() {
    // Hide the start button and overlay once the game starts
    overlay.style.display = 'none';
    startButton.style.display = 'none';
    startTimer();
}

function startTimer() {
    // Start the timer and update the timer element every second
    timerInterval = setInterval(() => {
        timerCount--;
        timerElement.textContent = timerCount;
        if (timerCount === 0) {
            clearInterval(timerInterval);
            showRetryNotification();
        }
    }, 1000);
}

function stopTimer() {
    // Stop the timer
    clearInterval(timerInterval);
}

// Add event listeners to all draggable elements
draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
});

// Add event listeners to all droppable elements
droppableElements.forEach(elem => {
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("drop", drop);
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragleave", dragLeave);
});

function dragStart(event) {
    // Store the id of the dragged element
    event.dataTransfer.setData("text", event.target.id);
}

function dragEnter(event) {
    // Highlight the droppable area when a draggable element enters
    event.target.classList.add("droppable-hover");
}

function dragLeave(event) {
    // Remove highlight from the droppable area when the draggable element leaves
    event.target.classList.remove("droppable-hover");
}

function dragOver(event) {
    // Allow dropping by preventing the default behavior
    event.preventDefault();
}

function drop(event) {
    // Handle the drop event
    event.preventDefault();
    const draggableElementData = event.dataTransfer.getData("text");
    const droppableElementData = event.target.getAttribute("data-draggable-id");
    if (draggableElementData === droppableElementData) {
        // If the dropped element matches, update styles and increment the correct count
        event.target.classList.add("dropped");
        const draggableElement = document.getElementById(draggableElementData);
        event.target.style.backgroundColor = draggableElement.style.backgroundColor;
        draggableElement.classList.add("dragged");
        draggableElement.setAttribute("draggable", "false");
        const newDiv = document.createElement("div");
        newDiv.classList.add("square.draggableElementData");
        event.target.insertBefore(newDiv, event.target.firstChild);
        incrementCorrectCount();
        const correctTiles = document.querySelectorAll('.dropped');
        if (correctTiles.length === 8) {
            stopTimer();
            showCongratulations();
        }
    } else {
        // If the dropped element does not match, show a notification
        showNotification();
    }
}

function showNotification() {
    // Show a notification when an incorrect match is made
    let wrong = document.createElement("span");
    wrong.classList.add("wrong-notif");
    notification.innerHTML = "";
    wrong.innerHTML = `Oops, that is not right. Match the number with the correct word`;
    notification.append(wrong);
    notification.classList.add("show");
    overlay.style.display = "block";
    incrementWrongCount();
    setTimeout(closeDiv, 2000);
}

function closeDiv() {
    // Close the notification
    notification.classList.remove("show");
    overlay.style.display = "none";
}

function incrementCorrectCount() {
    // Increment the correct count and update the energy bar
    correctCount++;
    correctCountElement.textContent = correctCount;
    updateEnergyBar();
}

function incrementWrongCount() {
    // Increment the wrong count and update the energy bar
    wrongCount++;
    wrongCountElement.textContent = wrongCount;
    updateEnergyBar();
}

function updateEnergyBar() {
    // Update the energy bar based on the correct count
    const fillPercentage = (correctCount / maxCount) * 100;
    energyFillElement.style.width = `${fillPercentage}%`;
}

function showCongratulations() {
    // Show a congratulations message and buttons to replay, go to the next level, or main page
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
    replayButton.addEventListener("click", replay);
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

    // const exitButton = document.createElement("button");
    // exitButton.textContent = "Exit";
    // exitButton.classList.add("play-button");
    // exitButton.addEventListener("click", exit);
    // buttonContainer.appendChild(exitButton);

    congratulationsDiv.appendChild(buttonContainer);
    document.body.appendChild(congratulationsDiv);
}

function replay() {
    // Logic to replay the level
    location.href = "https://rudhraa-r.github.io/HopScotch-/Lvl_2/index2.html";
}

function nextLevel() {
    // Logic to proceed to the next level
    return window.location.href = "https://rudhraa-r.github.io/HopScotch-/Lvl_3/index3.html";
}

function mainLevel() {
    // Logic to go to the main page
    return window.location.href = "https://rudhraa-r.github.io/HopScotch-/main.html";
}

// function exit() {
//     // Logic to exit the game or go back to the main menu
//     window.open = "main.html";
// }

// Add a shuffle button to randomize the draggable elements
const draggableContainer = document.querySelector('.draggable-elements');
const shuffleButton = document.createElement('button');
shuffleButton.classList.add('shuffle-button');
shuffleButton.textContent = 'Shuffle';
shuffleButton.addEventListener('click', shuffleDraggableElements);
document.body.insertBefore(shuffleButton, draggableContainer);

setTimeout(() => {
    shuffleButton.classList.add('show');
}, 100);

function shuffleDraggableElements() {
    // Shuffle the order of the draggable elements
    const draggableElements = Array.from(draggableContainer.querySelectorAll('.draggable'));
    draggableElements.forEach(element => {
        draggableContainer.removeChild(element);
    });

    shuffleArray(draggableElements);

    draggableElements.forEach(element => {
        draggableContainer.appendChild(element);
    });
}

function shuffleArray(array) {
    // Randomly shuffle the elements in the array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function retryLevel() {
    // Logic to retry the current level
    window.location.href = "https://rudhraa-r.github.io/HopScotch-/Lvl_2/index2.html";
}

function showRetryNotification() {
    // Show a notification when the time is up and provide options to retry or go to the main page
    const retryDiv = document.createElement("div");
    retryDiv.classList.add("Retry");

    overlay.style.display = "block";
    const message = document.createElement("div");
    message.textContent = "Time's up! Please retry to arrange the tiles within 20 seconds.";
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
