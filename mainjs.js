// Select the elements from the DOM
const loadText = document.querySelector('.loading-text'); // The text element showing the loading percentage
const bg = document.querySelector('.bg'); // The background element to apply blur effect
const button = document.querySelector('.levels'); // The button element to apply blur effect
const bd = document.querySelector('.body'); // The body element (not used in the script, but selected)

// Initialize the loading counter
let load = 0;

// Start the interval to call the blurring function every 30 milliseconds
let int = setInterval(blurring, 30);

// The blurring function to update the loading text and apply blur effects
function blurring() {
    load++; // Increment the load counter

    // If the load counter exceeds 99, clear the interval to stop the blurring function
    if (load > 99) {
        clearInterval(int);
    }

    // Update the loading text to show the current load percentage
    loadText.innerText = `${load}%`;
    // Adjust the opacity of the loading text from 1 to 0 as load goes from 0 to 100
    loadText.style.opacity = scale(load, 0, 100, 1, 0);
    // Adjust the blur effect on the background from 30px to 0px as load goes from 0 to 100
    bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
    // Adjust the blur effect on the button from 30px to 0px as load goes from 0 to 100
    button.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
}

// A utility function to map a number from one range to another
const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
