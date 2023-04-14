const switchEl = document.querySelector('.switch');
const switchInput = switchEl.querySelector('input');
let isTTSEnabled = localStorage.getItem('isTTSEnabled') === 'true' ? true : false;
let currentHighlightedElement = null;
let currentUtterance = null;

function speakText(text) {
  // Stop speaking if there is already an active utterance
  if (currentUtterance !== null) {
    window.speechSynthesis.cancel();
  }

  // Create and speak the utterance with normal speed
  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 1.0;
  window.speechSynthesis.speak(currentUtterance);

  // Highlight the whole element being spoken
  this.classList.add('highlighted');
  currentHighlightedElement = this;

  // Remove highlighting from the element once it has been spoken
  currentUtterance.onend = function() {
    currentHighlightedElement.classList.remove('highlighted');
    currentHighlightedElement = null;
    currentUtterance = null;
  };
}

function toggleTTS(event) {
  isTTSEnabled = !isTTSEnabled;
  localStorage.setItem('isTTSEnabled', isTTSEnabled);
  document.getElementById('voiceDeactiveImg').style.display = isTTSEnabled ? 'none' : 'block';
  document.getElementById('voiceActiveImg').style.display = isTTSEnabled ? 'block' : 'none';
  document.getElementById('toggle-button').textContent = isTTSEnabled ? 'Turn on Text-to-Speech' : 'Turn on Text-to-Speech';
}

// Set the initial state of the switch based on the value stored in localStorage
const switchState = localStorage.getItem('switchState');
if (switchState !== null) {
  switchInput.checked = switchState === 'true';
} else {
  // Set the switch state to off if it's not set in localStorage
  switchInput.checked = false;
  localStorage.setItem('switchState', 'false');
}

// Add a change event listener to the input element to update the localStorage when the switch state is changed
switchInput.addEventListener('change', () => {
  localStorage.setItem('switchState', switchInput.checked);
});

// Add event listener to the toggle button
document.getElementById('toggle-button').addEventListener('click', toggleTTS);

// Add event listener to all visible elements that can be read aloud
const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, button, label, li, td, th, small, option, textarea, icon, p, a, span, date, select');

elements.forEach((element) => {
  element.addEventListener('click', function(event) {
    if (isTTSEnabled) {
      if (currentHighlightedElement === this) {
        // Stop speaking if the same element is clicked again
        window.speechSynthesis.cancel();
        currentHighlightedElement.classList.remove('highlighted');
        currentHighlightedElement = null;
        currentUtterance = null;
      } else {
        // Speak the text of the clicked element with normal speed
        speakText.call(this, this.textContent);
      }
    }
  });
});

// Set the initial state of the Text-to-Speech feature based on the value stored in localStorage
if (isTTSEnabled) {
  document.getElementById('voiceDeactiveImg').style.display = 'none';
  document.getElementById('voiceActiveImg').style.display = 'block';
  document.getElementById('toggle-button').textContent = 'Turn off Text-to-Speech';
} else {
  document.getElementById('voiceDeactiveImg').style.display = 'block';
  document.getElementById('voiceActiveImg').style.display = 'none';
 document.getElementById('toggle-button').textContent = 'Turn on Text-to-Speech';
}
