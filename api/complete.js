export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId, title } = req.body;
  const userId = process.env.HABITICA_USER_ID;
  const apiToken = process.env.HABITICA_API_TOKEN;

  try {
    if (taskId) {
      const response = await fetch(`https://habitica.com/api/v3/tasks/${taskId}/score/up`, {
        method: 'POST',
        headers: {
          'x-api-user': userId,
          'x-api-key': apiToken,
	  'x-client': `${userId}-Habitica-Trello`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    const allTasks = await fetch('https://habitica.com/api/v3/tasks/user?type=todo', {
      headers: {
        'x-api-user': userId,
        'x-api-key': apiToken,
	'x-client': `${userId}-Habitica-Trello`
      }
    });

    const taskList = await allTasks.json();

    if (!taskList.data) {
      return res.status(500).json({ error: 'Could not retrieve Habitica tasks' });
    }

    const match = taskList.data.find(task => task.text.trim() === title.trim());

    if (!match) {
      return res.status(404).json({ error: `No matching Habitica task found for "${title}"` });
    }

    const completeResponse = await fetch(`https://habitica.com/api/v3/tasks/${match.id}/score/up`, {
      method: 'POST',
      headers: {
        'x-api-user': userId,
        'x-api-key': apiToken,
        'x-client': `${userId}-Habitica-Trello`,
        'Content-Type': 'application/json'
      }
    });

    const completeData = await completeResponse.json();
    return res.status(completeResponse.status).json(completeData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to complete task', details: err.message });
  }
}
