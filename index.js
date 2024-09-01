const { Client } = require('@notionhq/client');

exports.sendToNotion = async (req, res) => {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });

    const { databaseId, data } = req.body;

    try {
        const response = await notion.pages.create({
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
        });
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sending data to Notion.");
    }
};