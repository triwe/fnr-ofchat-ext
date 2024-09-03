let checkmarksVisible = false;
let selectedFeedback = [];
const CONFIG = window.CONFIG;

const NOTION_API_KEY = CONFIG.NOTION_API_KEY;
const GOOGLE_API_KEY = CONFIG.GOOGLE_API_KEY;
const FEEDBACK_DATABASE_ID = CONFIG.FEEDBACK_DATABASE_ID;
const REQUEST_DATABASE_ID = CONFIG.REQUEST_DATABASE_ID;

function sendDataToNotion(databaseId, data) {
    return fetch('https://us-central1-ofchat-ext-feedback.cloudfunctions.net/sendToNotion', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GOOGLE_API_KEY}`,  // Correct API Key from config.js
            'x-api-key': GOOGLE_API_KEY,                  // Ensure both headers use the correct API Key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            databaseId: databaseId,
            data: {
                title: data.title,
                feedback: data.feedback,
                category: data.category,
                tags: data.tags,
                memberProfileURL: data.memberProfileURL // Include the member profile URL
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
        return responseData; // Return the response data to confirm success
    })
    .catch(error => {
        console.error('Error sending data to Notion:', error);
        throw error; // Re-throw the error to be caught in the submit function
    });
}

function showConfirmationMessage(message) {
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

function showErrorMessage(message) {
    const sidebar = document.getElementById('feedback-sidebar');
    sidebar.innerHTML = `
        <div id="error-message" style="text-align: center; color: red; padding: 20px;">
            ${message}
        </div>
    `;

    // Automatically hide the error message after 5 seconds
    setTimeout(() => {
        resetSidebar(true);  // Reset or close the sidebar after showing the error
    }, 5000);
}

async function submitFeedbackForm() {
    const submitButton = document.getElementById('submit-feedback');
    submitButton.disabled = true; // Disable the button immediately after it's clicked

    const memberProfile = document.getElementById('member-profile').value;
    const feedback = document.getElementById('feedback').value;
    const category = document.getElementById('category').value;
    const tags = document.getElementById('tags').value;

    const data = {
        title: `Feedback from ${memberProfile}`,
        feedback,
        category,
        tags,
        memberProfileURL: memberProfile // Add the member profile URL here
    };

    try {
        await sendDataToNotion(FEEDBACK_DATABASE_ID, data);
        showConfirmationMessage('Feedback Submitted'); // Show confirmation message here
        console.log('Feedback successfully submitted to Notion');
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showErrorMessage('Failed to submit feedback. Please try again.');
        submitButton.disabled = false; // Re-enable the button if submission fails
    }

    resetSidebar(true); // Reset the sidebar after submission
}

async function submitRequestForm() {
    const submitButton = document.getElementById('submit-request');
    submitButton.disabled = true; // Disable the button immediately after it's clicked

    const requestSubject = document.getElementById('request-subject').value;
    const memberProfile = document.getElementById('member-profile').value;
    const requestDetails = document.getElementById('request-details').value;
    const budget = document.getElementById('budget').value;
    const notes = document.getElementById('notes').value;

    const data = {
        title: `Request from ${memberProfile}`,
        feedback: `${requestSubject}\n\n${requestDetails}\n\nBudget: ${budget}\nNotes: ${notes}`,
        category: 'Request',
        tags: 'Request',
        memberProfileURL: memberProfile // Add the member profile URL here
    };

    try {
        await sendDataToNotion(REQUEST_DATABASE_ID, data);
        showConfirmationMessage('Request Submitted'); // Show confirmation message here
        console.log('Request successfully submitted to Notion');
    } catch (error) {
        console.error('Error submitting request:', error);
        showErrorMessage('Failed to submit request. Please try again.');
        submitButton.disabled = false; // Re-enable the button if submission fails
    }

    resetSidebar(true); // Reset the sidebar after submission
}

// Additional functions and event listeners follow...

// Additional sidebar.js functionality for checkboxes and UI interactions follows...

// Function to add checkboxes next to each message or comment
function addCheckboxes() {
    const messages = document.querySelectorAll('.b-chat__message__text');
    const comments = document.querySelectorAll('.b-comments__item-text');

    messages.forEach(message => {
        if (message && !message.querySelector('.feedback-checkbox')) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feedback-checkbox';
            checkbox.addEventListener('change', updateSelectedFeedback);
            message.prepend(checkbox);
        }
    });

    comments.forEach(comment => {
        if (comment && !comment.querySelector('.feedback-checkbox')) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feedback-checkbox';
            checkbox.addEventListener('change', updateSelectedFeedback);
            comment.prepend(checkbox);
        }
    });

    const sendFeedbackButton = document.getElementById('send-feedback');
    const sendRequestButton = document.getElementById('send-request');
    if (sendFeedbackButton) sendFeedbackButton.style.display = 'block';
    if (sendRequestButton) sendRequestButton.style.display = 'block';
    checkmarksVisible = true;
}

function extractUserIDFromURL() {
  const url = window.location.href;
  const match = url.match(/\/my\/chats\/chat\/([^/]+)/);
  return match ? match[1] : null;
}

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

function removeCheckboxes() {
    const checkboxes = document.querySelectorAll('.feedback-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.remove();
    });

    document.getElementById('send-feedback').style.display = 'none';
    document.getElementById('send-request').style.display = 'none';
    checkmarksVisible = false;
}

function gatherFeedbackAndShowForm() {
    updateSelectedFeedback();

    if (selectedFeedback.length > 0) {
        showFeedbackForm();
    } else {
        displayNoSelectionMessage();
    }
}

function gatherRequestsAndShowForm() {
    updateSelectedFeedback();

    if (selectedFeedback.length > 0) {
        showRequestForm();
    } else {
        displayNoSelectionMessage();
    }
}

function displayNoSelectionMessage() {
    const sidebar = document.getElementById('feedback-sidebar');
    const message = document.createElement('div');
    message.id = 'no-selection-message';
    message.innerText = 'Nothing selected';
    message.style.color = 'red';
    message.style.textAlign = 'center';
    sidebar.appendChild(message);

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

  document.getElementById('submit-feedback').addEventListener('click', submitFeedbackForm);

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
      let value = input.value.replace(/\D/g, ''); // Remove any non-digit characters
      
      if (value) {
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
    }, 3000); // 3000 ms = 3 seconds
}

function resetSidebar(fullyClose) {
    setTimeout(() => {
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
    }, 3000); // Add delay to match the time in showConfirmationMessage
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