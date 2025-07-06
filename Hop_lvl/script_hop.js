class HopscotchGame {
  constructor(level, levelSequences, targetStep = null) {
    this.levelSequences = levelSequences;
    this.currentLevel = level;
    this.availableButtons = this.levelSequences[level];
    this.targetStep = targetStep || this.availableButtons.length; // Default to full sequence if no target
    this.yPosition = 0;
    this.xPosition = 0;

    this.buttonContainer = document.getElementById('buttonContainer');
    this.destinationContainer = document.getElementById('destinationContainer');
    this.lvlNo = document.getElementById('headingText');
    this.checkButton = document.getElementById('checkButton');
    this.resetButton = document.getElementById('resetButton');
    this.runButton = document.getElementById('runButton');
    this.character = document.getElementById('character');
    this.jump = document.getElementById('jump');
    this.hop = document.getElementById('hop');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.nextlvl = parseInt(this.currentLevel) + 1;
    this.addEventListeners();
  }

  addEventListeners() {
    this.resetButton.addEventListener('click', () => this.resetGame());
    this.runButton.addEventListener('click', () => this.runSequence());
    this.checkButton.addEventListener('click', () => this.checkSequence());
    this.buttonContainer.addEventListener('dragstart', event => this.handleDragStart(event));
    this.destinationContainer.addEventListener('dragover', event => this.handleDragOver(event));
    this.destinationContainer.addEventListener('drop', event => this.handleDrop(event));
  }

  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const buttonId = event.dataTransfer.getData('text/plain');
    const draggedButton = document.getElementById(buttonId);
    if (draggedButton) {
      // Check if we've already reached the target step
      const currentOrder = Array.from(this.destinationContainer.children).map(wrapper => wrapper.querySelector('button')?.dataset.action);
      const targetLength = Math.min(this.targetStep, this.availableButtons.length);
      
      if (currentOrder.length >= targetLength) {
        // Don't allow more tiles to be placed
        return;
      }
      
      const wrapper = draggedButton.parentElement;
      this.destinationContainer.appendChild(wrapper);
      draggedButton.setAttribute("draggable", "false");
      draggedButton.style.cursor = 'no-drop';
      
      // Check if the dropped tile is in the correct position
      this.checkWrongTile();
    }
  }

  isOrderCorrect(currentOrder) {
    // Check if the order is correct up to the target step
    const targetLength = Math.min(this.targetStep, this.availableButtons.length);
    // Allow player to place more tiles than target, but check only up to target
    if (currentOrder.length < targetLength) return false;
    for (let i = 0; i < targetLength; i++) {
      if (currentOrder[i] !== this.availableButtons[i]) return false;
    }
    return true;
  }

  checkWrongTile() {
    const currentOrder = Array.from(this.destinationContainer.children).map(wrapper => wrapper.querySelector('button')?.dataset.action);
    
    // Check each position up to the target step to see if the tile is wrong
    const targetLength = Math.min(this.targetStep, this.availableButtons.length);
    for (let i = 0; i < Math.min(currentOrder.length, targetLength); i++) {
      if (currentOrder[i] !== this.availableButtons[i]) {
        // Wrong tile detected - show popup
        this.showWrongMessage();
        return;
      }
    }
    
    // If we've reached the target step, disable remaining buttons
    if (currentOrder.length >= targetLength) {
      this.disableRemainingButtons();
    }
  }

  showWrongMessage() {
    const wrongBtn = document.getElementById('wrongButton');
    const tryAgainBtn = document.getElementById('tryAgainButton');
    
    wrongBtn.classList.remove('hidden');
    wrongBtn.classList.add('show');
    
    // Show "Try Again" button after wrong message
    setTimeout(() => {
      wrongBtn.classList.remove('show');
      
      // Hide all other control buttons
      this.runButton.style.display = 'none';
      this.resetButton.style.display = 'none';
      this.checkButton.style.display = 'none';
      
      // Show only the Try Again button
      tryAgainBtn.style.display = 'inline-block';
      
      // Add event listener for try again button
      tryAgainBtn.onclick = () => this.removeLastTile();
    }, 2500); // Show wrong message for 2.5 seconds
  }

  removeLastTile() {
    const tryAgainBtn = document.getElementById('tryAgainButton');
    tryAgainBtn.style.display = 'none';
    
    // Restore all control buttons
    this.runButton.style.display = 'inline-block';
    this.resetButton.style.display = 'inline-block';
    this.checkButton.style.display = 'inline-block';
    
    // Remove the last tile from destination container
    const destinationContainer = this.destinationContainer;
    if (destinationContainer.children.length > 0) {
      const lastTile = destinationContainer.lastElementChild;
      const button = lastTile.querySelector('button');
      
      // Move the tile back to the button container
      this.buttonContainer.appendChild(lastTile);
      
      // Make the button draggable again
      button.setAttribute("draggable", "true");
      button.style.cursor = 'move';
    }
  }

  resetGame() {
    while (this.destinationContainer.firstChild) {
      this.buttonContainer.appendChild(this.destinationContainer.firstChild);
    }
    const buttons = Array.from(this.buttonContainer.querySelectorAll("button"));
    buttons.forEach(button => {
      button.setAttribute("draggable", "true");
      button.style.cursor = 'move';
    });
    this.availableButtons = this.levelSequences[this.currentLevel];
    this.character.style.transform = `translateY(0px) translateX(0px)`;
  }

  disableRemainingButtons() {
    const buttons = Array.from(this.buttonContainer.querySelectorAll("button"));
    buttons.forEach(button => {
      button.setAttribute("draggable", "false");
      button.style.cursor = 'not-allowed';
      button.style.opacity = '0.5';
    });
  }

  moveCharacter(buttonSequence, callback) {
    let index = 0;
    this.character.style.transform = `translateY(0px) translateX(0px)`;

    const explanations = {
        'Hop': "Hop: A short leap forward.",
        'Skip': "Skip: A longer skip forward.",
        'Jump': "Jump: A high jump.",
        'Skip-HopRight': "Diagonal move to the right.",
        'Skip-HopLeft': "Diagonal move to the left."
    };

    // Hide all control buttons initially
    this.runButton.style.display = 'none';
    this.checkButton.style.display = 'none';
    this.resetButton.style.display = 'none';
    
    // Show only the next button
    const nextBtn = document.getElementById('nextStepButton');
    const prevBtn = document.getElementById('prevStepButton');
    nextBtn.style.display = 'inline-block';
    prevBtn.style.display = 'none';

    // Remove any previous fades
    Array.from(this.destinationContainer.querySelectorAll('.previous-step')).forEach(el => el.classList.remove('previous-step'));

    const updateStep = () => {
        // Highlight previous steps
        Array.from(this.destinationContainer.children).forEach((wrap, idx) => {
            const btn = wrap.querySelector('button');
            const expl = wrap.querySelector('.explanation-text');
            if (idx < index) {
                btn && btn.classList.add('previous-step');
                expl && expl.classList.add('previous-step');
            } else {
                btn && btn.classList.remove('previous-step');
                expl && expl.classList.remove('previous-step');
            }
        });

        // Calculate total movement up to current step (only up to target step)
        let totalY = 0;
        let totalX = 0;
        const maxSteps = Math.min(this.targetStep, buttonSequence.length);
        for (let i = 0; i <= Math.min(index, maxSteps - 1); i++) {
            const action = buttonSequence[i];
            switch (action) {
                case 'Hop': totalY += 80; break;
                case 'Skip': totalY += 150; break;
                case 'Jump': totalY += 80; break;
                case 'Skip-HopRight': totalY += 80; totalX += 32; break;
                case 'Skip-HopLeft': totalY += 80; totalX -= 32; break;
            }
        }
        this.character.style.transform = `translateY(${-totalY}px) translateX(${totalX}px)`;

        // Set character image based on current action
        const currentAction = buttonSequence[index];
        if (currentAction === 'Jump') {
            this.hop.style.display = 'none';
            this.jump.style.display = 'block';
        } else if (currentAction === 'Hop' || currentAction === 'Skip-HopRight' || currentAction === 'Skip-HopLeft') {
            this.hop.style.display = 'block';
            this.jump.style.display = 'none';
        } else {
            this.hop.style.display = 'block';
            this.jump.style.display = 'none';
        }
    };

    const updateExplanation = () => {
        Array.from(this.destinationContainer.querySelectorAll('.explanation-text')).forEach(e => e.remove());
        if (index < buttonSequence.length) {
            const wrapper = this.destinationContainer.children[index];
            const msg = document.createElement('div');
            msg.className = 'explanation-text';
            msg.innerText = explanations[buttonSequence[index]] || "Unknown step";
            wrapper.appendChild(msg);
        }
    };

    // Initialize the first step immediately
    updateStep();
    updateExplanation();

    nextBtn.onclick = () => {
        const maxIndex = Math.min(this.targetStep - 1, buttonSequence.length - 1);
        if (index < maxIndex) {
            index++;
            updateStep();
            updateExplanation();
            if (index > 0) {
                prevBtn.style.display = 'inline-block';
            }
        } else {
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
            this.runButton.style.display = 'inline-block';
            this.checkButton.style.display = 'inline-block';
            this.resetButton.style.display = 'inline-block';
            if (callback) callback();
        }
    };

    prevBtn.onclick = () => {
        if (index > 0) {
            index--;
            updateStep();
            updateExplanation();
            if (index === 0) {
                prevBtn.style.display = 'none';
            }
        }
    };
}

  checkSequence() {
    const currentOrder = Array.from(this.destinationContainer.children).map(wrapper => wrapper.querySelector('button')?.dataset.action);
    const targetLength = Math.min(this.targetStep, this.availableButtons.length);
    
    // Only check if we have the correct number of tiles for target step
    if (currentOrder.length !== targetLength) {
      alert(`You need to place exactly ${targetLength} tiles to match the stone landing position!`);
      return;
    }
    
    this.moveCharacter(currentOrder, () => {
      if (this.isOrderCorrect(currentOrder)) {
        alert('The order is right, now use the run button to finish the level');
      } else {
        alert('The order is not right or it is incomplete. Check the animation & use the reset button to try again !!');
      }
      this.character.style.transform = `translateY(0px) translateX(0px)`;
      this.xPosition = 0;
      this.yPosition = 0;
    });
  }

  runSequence() {
    const currentOrder = Array.from(this.destinationContainer.children).map(wrapper => wrapper.querySelector('button')?.dataset.action);
    const targetLength = Math.min(this.targetStep, this.availableButtons.length);
    
    // Only run if we have the correct number of tiles for target step
    if (currentOrder.length !== targetLength) {
      alert(`You need to place exactly ${targetLength} tiles to match the stone landing position!`);
      return;
    }
    
    this.moveCharacter(currentOrder, () => {
      if (this.isOrderCorrect(currentOrder)) {
        showCorrectMessage();
      }
      // Removed the alert popup - now only the correct message shows
    });
  }

  redirectToPage(url) {
    window.location.href = url;
  }
}

const levelSequences = {
  1: ['Skip', 'Hop', 'Jump', 'Hop', 'Jump'],
  2: ['Hop', 'Skip', 'Jump', 'Hop', 'Jump'],
  3: ['Hop', 'Hop', 'Skip', 'Hop', 'Jump'],
  4: ['Hop', 'Hop', 'Hop', 'Skip-HopRight', 'Hop', 'Jump'],
  5: ['Hop', 'Hop', 'Hop', 'Skip-HopLeft', 'Hop', 'Jump'],
  6: ['Hop', 'Hop', 'Hop', 'Jump', 'Skip'],
  7: ['Hop', 'Hop', 'Hop', 'Jump', 'Hop', 'Skip-HopRight'],
  8: ['Hop', 'Hop', 'Hop', 'Jump', 'Hop', 'Skip-HopLeft'],
};

let game;

function initializeGame(round) {
  if (game) {
    document.getElementById('destinationContainer').innerHTML = '';
    document.getElementById('buttonContainer').innerHTML = '';
  }

  document.getElementById('currentRound').innerText = round;
  const actions = levelSequences[round];
  const buttonContainer = document.getElementById('buttonContainer');
  buttonContainer.innerHTML = '';

  actions.forEach((action, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'destination-item';

    const button = document.createElement('button');
    button.innerText = action.replace(/-/g, ' & ');
    button.setAttribute('draggable', 'true');
    button.id = `${action}${index}`;
    button.dataset.action = action;
    button.className = 'game-button';

    wrapper.appendChild(button);
    buttonContainer.appendChild(wrapper);
  });

  // Start with stone throw to determine target step
  startStoneThrow(round, (targetStep) => {
    game = new HopscotchGame(round, levelSequences, targetStep);
  });
}

function startStoneThrow(round, callback) {
  const stone = document.getElementById('stone');
  const droppableElements = document.querySelector('.droppable-elements');
  const actions = levelSequences[round];
  
  // Randomly select which step the stone will land on (1 to total steps)
  const targetStep = Math.floor(Math.random() * actions.length) + 1;
  
  // Position stone relative to the droppable elements container
  const droppableRect = droppableElements.getBoundingClientRect();
  
  // Calculate the final position where stone should land (based on target step)
  const tileHeight = droppableRect.height / actions.length;
  const finalY = droppableRect.top + (actions.length - targetStep) * tileHeight;
  
  // Position stone at the bottom of the hopscotch tiles
  stone.style.position = 'fixed';
  stone.style.left = (droppableRect.left + droppableRect.width / 2 - 10) + 'px';
  stone.style.top = (droppableRect.bottom + 20) + 'px';
  
  // Set the final position for the animation
  stone.style.setProperty('--final-y', `${finalY - droppableRect.bottom - 20}px`);
  
  // Show and animate stone
  stone.classList.remove('hidden');
  stone.classList.add('rolling');
  
  // After stone animation completes, keep stone visible and show target step message
  setTimeout(() => {
    stone.classList.remove('rolling');
    // Position stone at the final landing position
    stone.style.transform = `translateY(${finalY - droppableRect.bottom - 20}px) rotate(900deg) scale(1)`;
    
    // Show message about target step
    showTargetStepMessage(targetStep, actions.length, () => {
      stone.classList.add('hidden'); // Hide stone after message
      callback(targetStep);
    });
  }, 1500); // Match the animation duration
}

function showTargetStepMessage(targetStep, totalSteps, callback) {
  // Create a message overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  const messageBox = document.createElement('div');
  messageBox.style.cssText = `
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    padding: 2rem 3rem;
    border-radius: 15px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
    max-width: 400px;
  `;
  
  messageBox.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
    <div>Stone landed on step ${targetStep}!</div>
    <div style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">
      Complete the sequence up to step ${targetStep} of ${totalSteps}
    </div>
  `;
  
  overlay.appendChild(messageBox);
  document.body.appendChild(overlay);
  
  // Remove overlay after 3 seconds and continue
  setTimeout(() => {
    document.body.removeChild(overlay);
    callback();
  }, 3000);
}

function switchRound(roundNumber) {
  initializeGame(roundNumber);
}

function showCorrectMessage() {
  const correctBtn = document.getElementById('correctButton');
  correctBtn.classList.remove('hidden');
  correctBtn.classList.add('show');
  setTimeout(() => {
    correctBtn.classList.remove('show');
  }, 5000);
}