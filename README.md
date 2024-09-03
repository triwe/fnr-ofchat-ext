## FNR OFChat Extension Frontend

This repository contains the frontend code for the FNR OFChat Chrome extension. The extension is designed to help manage client interactions on OnlyFans by allowing users to submit feedback and requests directly to Notion databases. It includes features like a sidebar for feedback and request submissions, dynamic content selection, and integration with Notion for data storage.

### Features

- **Sidebar Interface**: The extension adds a sidebar to the OnlyFans chat page that allows users to submit feedback or requests.
- **Dynamic Content Selection**: Users can select chat messages or comments, which are dynamically added to the form fields.
- **Notion Integration**: The extension sends feedback and requests directly to specified Notion databases via a backend API.
- **User ID Autofill**: Automatically detects and fills out the member profile based on the current chat URL.
- **Secure API Key Handling**: Uses a `config.js` file to securely handle Notion API keys and database IDs.
- **GitHub Integration**: The project is set up with GitHub for version control.

### Technologies Used

- **JavaScript**: Core logic and interactions.
- **CSS**: Styling for the sidebar and form elements.
- **Chrome Extension API**: For injecting content scripts and background scripts.
- **Notion API**: Integration with Notion databases for storing feedback and requests.
- **Node.js**: (Upcoming) Backend logic for handling secure requests to the Notion API.

### Project Setup

1. **Initialize Git Repository**: The project is tracked using Git and hosted on GitHub.
2. **Secure Configuration**: Sensitive information like API keys and database IDs are stored in a `config.js` file that is excluded from version control using `.gitignore`.
3. **Content and Background Scripts**: The extension uses content scripts for interacting with the OnlyFans page and a background script for managing persistent tasks.
4. **Google Cloud Functions**: A backend function is being set up using Google Cloud Functions to securely handle requests to the Notion API.

### Current Progress

- **Frontend Development**: The core features of the frontend have been developed, including the sidebar, dynamic content selection, and Notion integration logic.
- **Notion API Integration**: The frontend is ready to send data to the Notion API, and a Google Cloud Function is being set up to handle the backend processing securely.
- **GitHub Integration**: The project has been pushed to GitHub, and version control is in place.

### Next Steps

- **Complete Google Cloud Functions Setup**: Finalize the backend setup for secure communication with the Notion API.
- **Testing and Debugging**: Ensure all features work seamlessly and perform extensive testing, especially on the API integration.
- **Deployment**: Package the extension for deployment and installation by users.

### Installation

To install the extension locally:

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/triwe/fnr-ofchat-ext-front.git
   cd fnr-ofchat-ext-front
   ```
2. Load the extension in Chrome:

   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the project directory.

3. **Configure API Keys**:
   - Rename `config.example.js` to `config.js`.
   - Add your Notion API keys and database IDs to `config.js`.

### Contributing

If you wish to contribute to the project, please fork the repository, create a new branch for your feature or bug fix, and submit a pull request.

### License

This project is licensed under the MIT License.
