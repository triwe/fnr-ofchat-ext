chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'sendDataToNotion') {
        const url = 'https://us-central1-ofchat-ext-feedback.cloudfunctions.net/sendToNotion';

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${message.apiKey}`, // Pass the Notion API key
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                databaseId: message.databaseId,
                data: {
                    title: message.data.title,
                    feedback: message.data.feedback,
                    category: message.data.category,
                    tags: message.data.tags
                }
            })
        })
        .then(response => response.json())
        .then(data => sendResponse({ status: 'success', data }))
        .catch(error => sendResponse({ status: 'error', error }));

        // Indicate that the response will be sent asynchronously
        return true;
    }
});