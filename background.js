chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'sendDataToNotion') {
      const { databaseId, apiKey, data } = message;
      const url = `https://api.notion.com/v1/pages`;

      fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
          },
          body: JSON.stringify({
              parent: { database_id: databaseId },
              properties: {
                  Title: {
                      title: [
                          {
                              text: {
                                  content: data.title
                              }
                          }
                      ]
                  },
                  Feedback: {
                      rich_text: [
                          {
                              text: {
                                  content: data.feedback
                              }
                          }
                      ]
                  },
                  Category: {
                      select: {
                          name: data.category
                      }
                  },
                  Tags: {
                      multi_select: data.tags.split(',').map(tag => ({ name: tag.trim() }))
                  }
              }
          }),
      })
      .then(response => response.json())
      .then(data => {
          console.log('Data added to Notion:', data);
          sendResponse({ status: 'success', data });
      })
      .catch(error => {
          console.error('Error:', error);
          sendResponse({ status: 'error', error });
      });

      // Return true to indicate that the response will be sent asynchronously
      return true;
  }
});