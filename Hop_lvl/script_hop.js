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
    }
  }

  isOrderCorrect(currentOrder) {
    if (currentOrder.length !== this.availableButtons.length) return false;
    for (let i = 0; i < this.availableButtons.length; i++) {
      if (currentOrder[i] !== this.availableButtons[i]) return false;
    }
    return true;
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

      const action = buttonSequence[index];
      let moveDistance = { y: 0, x: 0 };
      switch (action) {
        case 'Hop': 
          moveDistance = { y: 80, x: 0 }; 
          this.hop.style.display = 'block'; 
          this.jump.style.display = 'none'; 
          break;
        case 'Skip': 
          moveDistance = { y: 150, x: 0 }; 
          break;
        case 'Jump': 
          moveDistance = { y: 80, x: 0 }; 
          this.hop.style.display = 'none'; 
          this.jump.style.display = 'block'; 
          break;
        case 'Skip-HopRight': 
          moveDistance = { y: 80, x: 32 }; 
          this.hop.style.display = 'block'; 
          this.jump.style.display = 'none'; 
          break;
        case 'Skip-HopLeft': 
          moveDistance = { y: 80, x: -32 }; 
          this.hop.style.display = 'block'; 
          this.jump.style.display = 'none'; 
          break;
      }
      this.character.style.transform = `translateY(${-moveDistance.y * index}px) translateX(${moveDistance.x}px)`;
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

    updateStep();
    updateExplanation();
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
      } else {
        alert('Oops! The buttons are not in the correct order or some buttons are missing. Use the reset button and run again.');
      }
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