# OnlyFans Feedback and Request Extension

This repository contains the front-end code for a chrome browser extension that allows OnlyFans creators/managers to submit feedback and requests directly from the platform. The extension captures the data and sends it to a Notion database via the `SendToNotion` Cloud Function.

https://github.com/triwe/FnRsendToNotion

## Features

- **User-Friendly Interface:** Provides an easy-to-use interface for submitting feedback and requests from OnlyFans chats and comments.
- **Integrated with Notion:** Automatically sends sumitted feedback and request data to a Notion database.
- **Customizable:** Supports custom categories, tags, and fields.
- **CORS Support:** Configured to work seamlessly with the OnlyFans platform.

## Setup

### 1. Clone the Repository

Clone the repository to your local development environment:

```bash
git clone https://github.com/your-repo/onlyfans-feedback-extension.git
cd onlyfans-feedback-extension
```

````

### 2. Install Dependencies

Make sure you have Node.js installed, then install the necessary dependencies:

```bash
npm install
```

### 3. Configure the Extension

The extension configuration is managed through a `config.js` file. Follow these steps to set up your configuration:

#### Create a `config.js` File

Create a `config.js` file in the root of your `onlyfans-feedback-extension` directory:

```javascript
window.CONFIG = {
  NOTION_API_KEY: "your_notion_api_key",
  GOOGLE_API_KEY: "your_google_api_key",
  FEEDBACK_DATABASE_ID: "your_feedback_database_id",
  REQUEST_DATABASE_ID: "your_request_database_id",
};
```

- `NOTION_API_KEY`: Your Notion API key for accessing the Notion database.
- `GOOGLE_API_KEY`: Your Google API key used for authenticating with the `SendToNotion` Cloud Function.
- `FEEDBACK_DATABASE_ID`: The ID of the Notion database where feedback will be stored.
- `REQUEST_DATABASE_ID`: The ID of the Notion database where requests will be stored.

### 4. Load the Extension in Chrome

To load the extension into Chrome:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `onlyfans-feedback-extension` directory.

The extension should now be loaded and visible in your Chrome extensions.

## Usage

### Capturing Feedback and Requests

The extension allows users to select text from messages or comments on OnlyFans and submit them as feedback or requests:

1. **Toggle Sidebar:** Click the extension button to open the sidebar.
2. **Select Text:** Click on messages or comments to select the text you want to submit.
3. **Submit Feedback or Request:** Choose to submit the selected text as either feedback or a request.

### Custom Fields

The extension supports custom fields for feedback and requests:

- **Member Profile:** Automatically captures the URL of the OnlyFans profile.
- **Category:** Users can categorize their feedback as Positive, Neutral, or Negative.
- **Tags:** Users can add comma-separated tags to categorize feedback and requests further.

## Development

### File Structure

- `sidebar.js`: Main JavaScript file responsible for the sidebar functionality.
- `config.js`: Configuration file for API keys and database IDs.
- `sidebar.css`: Stylesheet for the extension's UI.
- `manifest.json`: Chrome extension manifest file that defines the extension's properties.
- `images/`: Directory containing extension icons and images.

### Local Development

To make changes to the extension:

1. Edit the relevant files in your local repository.
2. Reload the extension in Chrome to see the changes.

### Testing the Extension

For testing:

1. **Simulate Requests:** Use the Chrome DevTools Network tab to inspect requests sent to the `SendToNotion` function.
2. **Check Logs:** Use the `gcloud functions logs read sendToNotion` command to monitor logs from the Cloud Function.
3. **Notion Integration:** Verify that feedback and requests appear correctly in the Notion database.

## Troubleshooting

### Common Issues

1. **CORS Errors:** If you encounter CORS issues, ensure that the `Access-Control-Allow-Origin` header in the Cloud Function is set correctly.
2. **API Key Mismatch:** Ensure that the API keys in `config.js` match those set in your Cloud Function.
3. **Extension Not Loading:** Double-check that your `manifest.json` file is correctly configured and that all required files are present in the directory.

### Organization Policy Restrictions

If your deployment or execution fails due to restrictive organization policies, you may need to modify the policy to allow the necessary permissions. Refer to the [SendToNotion Cloud Function README](https://github.com/your-repo/send-to-notion#troubleshooting) for detailed troubleshooting steps.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
````
