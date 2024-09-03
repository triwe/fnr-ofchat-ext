let checkmarksVisible = false;
let selectedFeedback = [];
const CONFIG = window.CONFIG;

const NOTION_API_KEY = CONFIG.NOTION_API_KEY;
const GOOGLE_API_KEY = CONFIG.GOOGLE_API_KEY;
const FEEDBACK_DATABASE_ID = CONFIG.FEEDBACK_DATABASE_ID;
const REQUEST_DATABASE_ID = CONFIG.REQUEST_DATABASE_ID;

function sendDataToNotion(databaseId, data) {
    const apiKey = window.CONFIG.GOOGLE_API_KEY;  // Get the API key from config.js

    return fetch('https://us-central1-ofchat-ext-feedback.cloudfunctions.net/sendToNotion', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,  // Correct API Key from config.js
            'x-api-key': apiKey,                  // Ensure both headers use the correct API Key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            databaseId: databaseId,
            data: {
                title: data.title,
                feedback: data.feedback,
                category: data.category,
                tags: data.tags
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error sending data to Notion: ${response.statusText}`);
        }
        return response.json();
    })
    .then(responseData => {
        console.log('Response from Notion:', responseData);
    })
    .catch(error => {
        console.error('Error sending data to Notion:', error);
    });
}

async function submitFeedbackForm() {
    const memberProfile = document.getElementById('member-profile').value;
    const feedback = document.getElementById('feedback').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value;

    const data = {
        title: `Feedback from ${memberProfile}`,
        feedback,
        category,
        tags,
    };

    // Send form to Notion
    try {
        await sendDataToNotion(FEEDBACK_DATABASE_ID, data);
        showConfirmationMessage('Feedback Submitted');
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    }

    // Reset the sidebar after submission
    resetSidebar(true);
}

async function submitRequestForm() {
    const requestSubject = document.getElementById('request-subject').value;
    const memberProfile = document.getElementById('member-profile').value;
    const requestDetails = document.getElementById('request-details').value;
    const budget = document.getElementById('budget').value;
    const notes = document.getElementById('notes').value;

    // Ensure the data object is fully populated
    const data = {
        title: `Request from ${memberProfile}`,
        feedback: `${requestSubject}\n\n${requestDetails}\n\nBudget: ${budget}\nNotes: ${notes}`,
        category: 'Request',  // Assuming this is a fixed category for requests
        tags: 'Request'       // Assuming this is a fixed tag for requests
    };

    try {
        await sendDataToNotion(REQUEST_DATABASE_ID, data);
        showConfirmationMessage('Request Submitted');
    } catch (error) {
        console.error('Error submitting request:', error);
        alert('Failed to submit request. Please try again.');
    }

    resetSidebar(true);
}
// Remaining sidebar.js functionality...

// Additional sidebar.js functionality for checkboxes and UI interactions follows...

// Function to add checkboxes next to each message or comment
function addCheckboxes() {
    // Detect chat messages
    const messages = document.querySelectorAll('.b-chat__message__text');
    // Detect post comments
    const comments = document.querySelectorAll('.b-comments__item-text');

    // Add checkboxes to chat messages
    messages.forEach(message => {
        if (message && !message.querySelector('.feedback-checkbox')) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feedback-checkbox';
            checkbox.addEventListener('change', updateSelectedFeedback); // Attach event listener
            message.prepend(checkbox);
        }
    });

    // Add checkboxes to post comments
    comments.forEach(comment => {
        if (comment && !comment.querySelector('.feedback-checkbox')) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feedback-checkbox';
            checkbox.addEventListener('change', updateSelectedFeedback); // Attach event listener
            comment.prepend(checkbox);
        }
    });

    // Make sure the buttons exist before trying to style them
    const sendFeedbackButton = document.getElementById('send-feedback');
    const sendRequestButton = document.getElementById('send-request');
    if (sendFeedbackButton) sendFeedbackButton.style.display = 'block';
    if (sendRequestButton) sendRequestButton.style.display = 'block';
    checkmarksVisible = true;
}

// Function to extract the User ID from the current URL
function extractUserIDFromURL() {
  const url = window.location.href;
  const match = url.match(/\/my\/chats\/chat\/([^/]+)/);
  return match ? match[1] : null;
}

// Function to update selected feedback/request based on checked checkboxes
function updateSelectedFeedback() {
    selectedFeedback = [];
    const checkboxes = document.querySelectorAll('.feedback-checkbox:checked');
    checkboxes.forEach(checkbox => {
        selectedFeedback.push(checkbox.parentElement.innerText.trim());
    });

    const feedbackField = document.getElementById('feedback');
    const requestDetailsField = document.getElementById('request-details');

    if (feedbackField) {
        feedbackField.value = selectedFeedback.join('\n');
    }

    if (requestDetailsField) {
        requestDetailsField.value = selectedFeedback.join('\n');
    }
}

// Function to remove all checkboxes
function removeCheckboxes() {
    const checkboxes = document.querySelectorAll('.feedback-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.remove();
    });

    document.getElementById('send-feedback').style.display = 'none';
    document.getElementById('send-request').style.display = 'none';
    checkmarksVisible = false;
}

// Function to gather the checked messages/comments and switch to the feedback form
function gatherFeedbackAndShowForm() {
    updateSelectedFeedback(); // Ensure the latest selected items are captured

    if (selectedFeedback.length > 0) {
        // If checkboxes are selected, transition to the feedback form
        showFeedbackForm();
    } else {
        // If no checkboxes are selected, show a temporary message
        displayNoSelectionMessage();
    }
}

// Function to gather the checked messages/comments and switch to the request form
function gatherRequestsAndShowForm() {
    updateSelectedFeedback(); // Ensure the latest selected items are captured

    if (selectedFeedback.length > 0) {
        // If checkboxes are selected, transition to the request form
        showRequestForm();
    } else {
        // If no checkboxes are selected, show a temporary message
        displayNoSelectionMessage();
    }
}

// Function to display "Nothing selected" message
function displayNoSelectionMessage() {
    const sidebar = document.getElementById('feedback-sidebar');
    const message = document.createElement('div');
    message.id = 'no-selection-message';
    message.innerText = 'Nothing selected';
    message.style.color = 'red';
    message.style.textAlign = 'center';
    sidebar.appendChild(message);

    // Remove the message after 2 seconds
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function showFeedbackForm() {
  const userID = extractUserIDFromURL();
  const memberProfileURL = userID ? `onlyfans.com/u${userID}` : '';

  const sidebar = document.getElementById('feedback-sidebar');
  sidebar.innerHTML = `
      <form id="feedback-form">
          <label for="member-profile">Member Profile</label>
          <input type="text" id="member-profile" name="member-profile" value="${memberProfileURL}" placeholder="Enter profile link or name" required>

          <label for="feedback">Feedback</label>
          <textarea id="feedback" name="feedback">${selectedFeedback.join('\n')}</textarea>

          <label for="category">Category</label>
          <select id="category" name="category" required>
              <option value="" disabled selected>Select a category</option>
              <option value="Neutral">👌 Neutral</option>
              <option value="Positive">👍 Positive</option>
              <option value="Negative">👎 Negative</option>
          </select>

          <label for="tags">Tags</label>
          <input type="text" id="tags" name="tags" placeholder="Enter tags, comma-separated">

          <button type="button" id="submit-feedback">Send Feedback</button>
          <button type="button" id="cancel-feedback">Cancel</button>
      </form>
  `;

  // Event listener for form submission
  document.getElementById('submit-feedback').addEventListener('click', submitFeedbackForm);

  // Event listener for the cancel button
  document.getElementById('cancel-feedback').addEventListener('click', () => {
      resetSidebar(false);
  });
}

function showRequestForm() {
  const userID = extractUserIDFromURL();
  const memberProfileURL = userID ? `onlyfans.com/u${userID}` : '';

  const sidebar = document.getElementById('feedback-sidebar');
  sidebar.innerHTML = `
      <form id="request-form">
          <label for="request-subject">Request Subject</label>
          <input type="text" id="request-subject" name="request-subject" placeholder="Enter request subject" required>

          <label for="member-profile">Member Profile</label>
          <input type="text" id="member-profile" name="member-profile" value="${memberProfileURL}" placeholder="Enter profile link or name" required>

          <label for="request-details">Request Details</label>
          <textarea id="request-details" name="request-details">${selectedFeedback.join('\n')}</textarea>

          <label for="budget">Budget</label>
          <input type="text" id="budget" name="budget" placeholder="Enter budget" required>

          <label for="notes">Notes</label>
          <textarea id="notes" name="notes" placeholder="Enter any additional notes"></textarea>

          <button type="button" id="submit-request">Send Request</button>
          <button type="button" id="cancel-request">Cancel</button>
      </form>
  `;

  // Add event listener to format the budget input as USD
  document.getElementById('budget').addEventListener('input', formatBudgetAsUSD);

  // Event listener for form submission
  document.getElementById('submit-request').addEventListener('click', submitRequestForm);

  // Event listener for the cancel button
  document.getElementById('cancel-request').addEventListener('click', () => {
      resetSidebar(false);
  });
}

// Function to format the budget input as USD
function formatBudgetAsUSD(event) {
    const input = event.target;
    // Remove any non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    if (value) {
        // Format as USD without decimals
        value = parseInt(value, 10).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        input.value = value;
    } else {
        input.value = '';
    }
}

// Function to handle feedback form submission
async function submitFeedbackForm() {
  const memberProfile = document.getElementById('member-profile').value;
  const feedback = document.getElementById('feedback').value;
  const category = document.getElementById('category').value;
  const tags = document.getElementById('tags').value;

  // Print all the form data to the console (for testing)
  console.log('Feedback Form Submitted:');
  console.log('Member Profile:', memberProfile);
  console.log('Feedback:', feedback);
  console.log('Category:', category);
  console.log('Tags:', tags);

  // Prepare the data object to send to Notion
  const data = {
    title: `Feedback from ${memberProfile}`,
      feedback,
     category,
     tags,
    };

  // Send form to Notion
  try {
      await sendDataToNotion(FEEDBACK_DATABASE_ID, NOTION_API_KEY, data);
      showConfirmationMessage('Feedback Submitted');
  } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
  }

  // Reset the sidebar after submission
  resetSidebar(true);
}

// Function to handle request form submission
async function submitRequestForm() {
  const requestSubject = document.getElementById('request-subject').value;
  const memberProfile = document.getElementById('member-profile').value;
  const requestDetails = document.getElementById('request-details').value;
  const budget = document.getElementById('budget').value;
  const notes = document.getElementById('notes').value;

  // Print all the form data to the console (for testing)
  console.log('Request Form Submitted:');
  console.log('Request Subject:', requestSubject);
  console.log('Member Profile:', memberProfile);
  console.log('Request Details:', requestDetails);
  console.log('Budget:', budget);
  console.log('Notes:', notes);

  // Prepare the data object to send to Notion
  const data = {
      title: `Request from ${memberProfile}`, // Adjust the title as needed
      feedback: `${requestSubject}\n\n${requestDetails}\n\nBudget: ${budget}\nNotes: ${notes}`,
      category: 'Request', // Assuming requests are categorized separately
      tags: 'Request', // Tags can be adjusted as needed
  };

  // Send form to Notion
  try {
      await sendDataToNotion(REQUEST_DATABASE_ID, NOTION_API_KEY, data);
      showConfirmationMessage('Request Submitted');
  } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
  }

  // Reset the sidebar after submission
  resetSidebar(true);
}
// Function to display a confirmation message
function showConfirmationMessage(message) {
  const sidebar = document.getElementById('feedback-sidebar');
  sidebar.innerHTML = `
      <div id="confirmation-message" style="text-align: center; padding: 20px;">
          ${message}
      </div>
  `;

  // Automatically hide the confirmation message after 3 seconds
  setTimeout(() => {
      resetSidebar(true);  // You can either reset or close the sidebar after confirmation
  }, 3000);
}

// Function to reset the sidebar to its initial state and reattach event listeners
function resetSidebar(fullyClose) {
    const sidebar = document.getElementById('feedback-sidebar');
    sidebar.innerHTML = `
        <button id="send-feedback" style="display: none;">Send Feedback</button>
        <button id="send-request" style="display: none;">Send Request</button>
    `;
    checkmarksVisible = false;
    removeCheckboxes();

    if (fullyClose) {
        sidebar.classList.remove('open');
        sidebar.style.right = '-200px'; // Move off-screen
    } else {
        sidebar.classList.remove('open');
        sidebar.style.right = '-200px'; // Move off-screen but keep ready to reopen
    }

    // Reattach event listeners
    attachButtonListeners();
}

// Function to attach event listeners to buttons
function attachButtonListeners() {
    document.getElementById('send-feedback').addEventListener('click', gatherFeedbackAndShowForm);
    document.getElementById('send-request').addEventListener('click', gatherRequestsAndShowForm);
}

// Function to inject the sidebar into the page
function injectSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'feedback-sidebar';
    sidebar.innerHTML = `
        <button id="send-feedback" style="display: none;">Send Feedback</button>
        <button id="send-request" style="display: none;">Send Request</button>
    `;
    document.body.appendChild(sidebar);

    // Link the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('sidebar.css');
    document.head.appendChild(link);

    // Inject the style to hide the OnlyFans help button
    const style = document.createElement('style');
    style.innerHTML = `
        .contact_button.visible-lg.has-tooltip {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const toggleButton = document.createElement('div');
    toggleButton.id = 'feedback-toggle';
    toggleButton.innerText = '⇨';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', () => {
        const sidebar = document.getElementById('feedback-sidebar');
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            sidebar.style.right = '-200px';  // Move sidebar off-screen
            toggleButton.innerText = '⇨';
            if (checkmarksVisible) {
                removeCheckboxes();
            }
        } else {
            sidebar.classList.add('open');
            sidebar.style.right = '0';       // Bring sidebar back on screen
            toggleButton.innerText = '⇦';
            addCheckboxes();  // Add checkboxes to both chat messages and comments
        }
    });

    // Attach button listeners initially
    attachButtonListeners();
}

// Inject the sidebar when the content script is loaded
injectSidebar();