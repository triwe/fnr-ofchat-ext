// Function to add checkboxes next to each message
function addCheckboxes() {
    const messages = document.querySelectorAll('.b-chat__message__text');
    messages.forEach(message => {
        // Check if a checkbox already exists; if not, add one
        if (!message.querySelector('.feedback-checkbox')) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feedback-checkbox';
            message.prepend(checkbox);
        }
    });
}

// Function to gather the checked messages and then remove the checkboxes
function getCheckedMessages() {
    const checkedMessages = [];
    const checkboxes = document.querySelectorAll('.feedback-checkbox:checked');
    
    checkboxes.forEach(checkbox => {
      checkedMessages.push(checkbox.parentElement.innerText.trim());
    });
  
    if (checkedMessages.length > 0) {
      // Print the checked messages to the console (for testing)
      console.log('Checked Messages:', checkedMessages);
      // Here you would send the data to Notion, but we'll just log it for now
    } else {
      console.log('No messages selected.');
    }
  
    // Uncheck and remove checkboxes after sending feedback
    removeCheckboxes();
  }

// Function to remove all checkboxes
function removeCheckboxes() {
    const checkboxes = document.querySelectorAll('.feedback-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.remove();
    });
}