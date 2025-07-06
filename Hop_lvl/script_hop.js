class HopscotchGame {
  constructor(level, levelSequences) {
    this.levelSequences = levelSequences;
    this.currentLevel = level;
    this.availableButtons = this.levelSequences[level];
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
      const wrapper = draggedButton.parentElement;
      this.destinationContainer.appendChild(wrapper);
      draggedButton.setAttribute("draggable", "false");
      draggedButton.style.cursor = 'no-drop';
      
      // Check if the dropped tile is in the correct position
      this.checkWrongTile();
    }
  }

  isOrderCorrect(currentOrder) {
    if (currentOrder.length !== this.availableButtons.length) return false;
    for (let i = 0; i < this.availableButtons.length; i++) {
      if (currentOrder[i] !== this.availableButtons[i]) return false;
    }
    return true;
  }

  checkWrongTile() {
    const currentOrder = Array.from(this.destinationContainer.children).map(wrapper => wrapper.querySelector('button')?.dataset.action);
    
    // Check each position to see if the tile is wrong
    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i] !== this.availableButtons[i]) {
        // Wrong tile detected - show popup
        this.showWrongMessage();
        return;
      }
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
      tryAgainBtn.style.display = 'inline-block';
      
      // Add event listener for try again button
      tryAgainBtn.onclick = () => this.removeLastTile();
    }, 5000); // Show wrong message for 5 seconds
  }

  removeLastTile() {
    const tryAgainBtn = document.getElementById('tryAgainButton');
    tryAgainBtn.style.display = 'none';
    
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

        // Calculate total movement up to current step
        let totalY = 0;
        let totalX = 0;
        for (let i = 0; i <= index; i++) {
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
        if (index < buttonSequence.length - 1) {
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

  game = new HopscotchGame(round, levelSequences);
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