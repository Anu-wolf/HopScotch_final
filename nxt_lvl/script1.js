// Select all draggable elements and droppable elements from the DOM
const draggableElements = document.querySelectorAll('.draggable');
const droppableElements = document.querySelectorAll('.droppable');

// Select notification and overlay elements
const notification = document.querySelector('.notification');
const overlay = document.querySelector('.overlay');
//instructions
const instt = document.querySelector('.inst');
// Select elements to display correct and wrong counts
const correctCountElement = document.querySelector('.correct-count .count');
const wrongCountElement = document.querySelector('.wrong-count .count');

// Select the energy fill element
const energyFillElement = document.querySelector('.energy-fill');

// Define the maximum count of correct drops
const maxCount = 8;

// Initialize correct and wrong counters
let correctCount = 0;
let wrongCount = 0;
updateEnergyBar();
// Add dragstart event listener to each draggable element
draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
});

// Add dragover, drop, dragenter, and dragleave event listeners to each droppable element
droppableElements.forEach(elem => {
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("drop", drop);
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragleave", dragLeave);
});

// Function to handle the dragstart event
function dragStart(event) {
    // Store the id of the dragged element in the dataTransfer object
    event.dataTransfer.setData("text", event.target.id);
}

// Function to handle the dragenter event
function dragEnter(event) {
    // Add a class to highlight the droppable element when a draggable element enters
    event.target.classList.add("droppable-hover");
}

// Function to handle the dragleave event
function dragLeave(event) {
    // Remove the highlight class when the draggable element leaves the droppable element
    event.target.classList.remove("droppable-hover");
}

// Function to handle the dragover event
function dragOver(event) {
    // Prevent the default behavior to allow dropping
    event.preventDefault();
}

// Function to handle the drop event
function drop(event) {
    // Prevent the default behavior
    event.preventDefault();

    // Get the id of the dragged element
    const draggableElementData = event.dataTransfer.getData("text");

    // Get the data-draggable-id attribute of the droppable element
    const droppableElementData = event.target.getAttribute("data-draggable-id");

    // Check if the dragged element's id matches the droppable element's data-draggable-id
    if (draggableElementData === droppableElementData) {
        // Add a class to indicate the element has been dropped correctly
        event.target.classList.add("dropped");

        // Get the dragged element by its id
        const draggableElement = document.getElementById(draggableElementData);

        // Set the background color of the droppable element to match the dragged element
        event.target.style.backgroundColor = draggableElement.style.backgroundColor;

        // Mark the dragged element as dragged and disable further dragging
        draggableElement.classList.add("dragged");
        draggableElement.setAttribute("draggable", "false");

        // Create a new div element and insert it into the droppable element
        const newDiv = document.createElement("div");
        newDiv.classList.add("square.draggableElementData");
        event.target.insertBefore(newDiv, event.target.firstChild);

        // Increment the correct count
        incrementCorrectCount();

        // Check if all correct moves have been made
        const correctTiles = document.querySelectorAll('.dropped');
        if (correctTiles.length === 8) {
            showCongratulations();
        }
    } else {
        // Show a notification for an incorrect drop
        showNotification();
    }
}

// Function to show a notification for an incorrect drop
function showNotification() {
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

// Function to close the notification
function closeDiv() {
    notification.classList.remove("show");
    overlay.style.display = "none";
}

// Function to increment the correct count
function incrementCorrectCount() {
    correctCount++;
    correctCountElement.textContent = correctCount;
    updateEnergyBar();

    // Show a message if all correct moves have been made
    if (correctCount === 8) {
        console.log("Congratulations! You've completed all correct moves.");
    }
}

// Function to increment the wrong count
function incrementWrongCount() {
    wrongCount++;
    wrongCountElement.textContent = wrongCount;
    updateEnergyBar();
}

// Function to update the energy bar based on the correct count
function updateEnergyBar() {
    const fillPercentage = (correctCount / maxCount) * 100;
    energyFillElement.style.width = `${fillPercentage}%`;
}

// Function to show the congratulations message when all tiles are correctly arranged
function showCongratulations() {
    const congratulationsDiv = document.createElement("div");
    congratulationsDiv.classList.add("congratulations");

    const message = document.createElement("div");
    message.textContent = "Congratulations! You have arranged all tiles correctly.";
    congratulationsDiv.appendChild(message);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Create and add the replay button
    const replayButton = document.createElement("button");
    replayButton.textContent = "Replay";
    replayButton.classList.add("play-button");
    replayButton.addEventListener("click", replay);
    buttonContainer.appendChild(replayButton);

    // Create and add the next level button
    const nextLevelButton = document.createElement("button");
    nextLevelButton.textContent = "Next Level";
    nextLevelButton.classList.add("play-button");
    nextLevelButton.addEventListener("click", nextLevel);
    buttonContainer.appendChild(nextLevelButton);

    // Create and add the main page button
    const mainLevelButton = document.createElement("button");
    mainLevelButton.textContent = "Main Page";
    mainLevelButton.classList.add("play-button");
    mainLevelButton.addEventListener("click", mainLevel);
    buttonContainer.appendChild(mainLevelButton);

    /*const exitButton = document.createElement("button");
    exitButton.textContent = "Exit";
    exitButton.classList.add("play-button");
    exitButton.addEventListener("click", exit);
    buttonContainer.appendChild(exitButton);*/
  

    // Append the button container to the congratulations div
    congratulationsDiv.appendChild(buttonContainer);

    // Append the congratulations div to the document body
    document.body.appendChild(congratulationsDiv);
}

// Function to replay the level
function replay() {
    location.href = "https://rudhraa-r.github.io/HopScotch-/nxt_lvl/index.html";
}

// Function to go to the next level
function nextLevel() {
    window.location.href = "https://reethika0503.github.io/HopScotch-.github.io/Lvl_2/index2.html";
}

// Function to go to the main page
function mainLevel() {
    window.location.href = "https://rudhraa-r.github.io/HopScotch-/main.html";
}
