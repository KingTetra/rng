<script>
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const rangeFrom = document.getElementById('range_from');
  const rangeTo = document.getElementById('range_to');
  const numbers = document.getElementById('numbers');
  const noRepeatsCheckbox = document.getElementById('no_repeats');
  const getRandomNumberBtn = document.querySelector('.btn');
  const randomNumberDisplay = document.getElementById('random_number');
  const saveNumberBtn = document.getElementById('save_number');
  const downloadPdfBtn = document.getElementById('download_pdf');
  const feedbackBtn = document.getElementById('feedback');
  const backButton = document.querySelector('.btn-black');
  let savedNumbers = [];
  let numbersHistory = []; // Store history of all generated numbers

  // Correctly placed generateRandomNumbers function
  function generateRandomNumbers() {
    const from = parseInt(rangeFrom.value, 10) || 0;
    const to = parseInt(rangeTo.value, 10) || 10;
    const count = parseInt(numbers.value, 10) || 1;
    const noRepeats = noRepeatsCheckbox.checked;
    let generatedNumbers = [];
    let attempts = 0;
    let array = new Uint32Array(1); // Create a typed array for CSPRNG

    while (generatedNumbers.length < count) {
      window.crypto.getRandomValues(array); // Get a secure random number
      const num = from + (array[0] % (to - from + 1)); // Scale it to the desired range

      // Before displaying new numbers, save the current (soon to be previous) state
      if (randomNumberDisplay.textContent !== 'will appear here' && randomNumberDisplay.textContent.trim() !== '') {
        numbersHistory.push(randomNumberDisplay.textContent.split(/,|\n| /).filter(n => n.trim() !== '').map(Number));
      }

      if (!noRepeats || !generatedNumbers.includes(num)) {
        generatedNumbers.push(num);
      }

      attempts++;
      if (attempts >= 10000) {
        break; // Prevent infinite loop
      }
    }

    if (generatedNumbers.length > 0) {
      displayNumbers(generatedNumbers);
    }
  }

  // Display Numbers function, correctly placed outside generateRandomNumbers
  function displayNumbers(numbers) {
    const format = document.getElementById('outputFormat').value;
    let output;
    switch (format) {
      case 'line':
        output = numbers.join('\n'); // New line for each number
        break;
      case 'comma':
        output = numbers.join(', '); // Comma-separated
        break;
      case 'space':
        output = numbers.join(' '); // Space-separated
        break;
      default:
        output = numbers.join(', '); // Default to comma-separated
    }
    randomNumberDisplay.textContent = output;
  }

    // Save/Favorite Number
    function saveNumber() {
      const currentNumbers = randomNumberDisplay.textContent;
      if (currentNumbers) {
        savedNumbers.push(currentNumbers);
        alert('Number saved!');
      }
    }

    function downloadPDF() {
        // Instantiate a new jsPDF object
        const doc = new window.jspdf.jsPDF();
        doc.text('Saved Numbers:', 10, 10);
        savedNumbers.forEach((number, index) => {
          doc.text(number, 10, 20 + (10 * index));
        });
        doc.save('saved-numbers.pdf');
      }


    // Feedback Button - Opens default mail client
    function sendFeedback() {
      window.location.href = 'mailto:simplysoundadvice@gmail.com?subject=Feedback for Random Number Generator';
    }

    backButton.addEventListener('click', function() {
  if (numbersHistory.length > 0) {
    const lastGeneratedNumbers = numbersHistory.pop(); // Get the last item
    displayNumbers(lastGeneratedNumbers); // Display it
  } else {
    alert("No previous numbers to show.");
  }
});

 // Event Listeners
  getRandomNumberBtn.addEventListener('click', generateRandomNumbers);
  saveNumberBtn.addEventListener('click', saveNumber);
  downloadPdfBtn.addEventListener('click', downloadPDF);
  feedbackBtn.addEventListener('click', sendFeedback);

  backButton.addEventListener('click', function() {
    if (numbersHistory.length > 0) {
      const lastGeneratedNumbers = numbersHistory.pop(); // Get the last set of numbers
      displayNumbers(lastGeneratedNumbers);
    } else {
      alert("No previous numbers to show.");
    }
  });
});
</script>
