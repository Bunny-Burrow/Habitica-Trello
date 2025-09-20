export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, notes, priority } = req.body;

  try {
    const response = await fetch('https://habitica.com/api/v3/tasks/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-user': process.env.HABITICA_USER_ID,
        'x-api-key': process.env.HABITICA_API_TOKEN,
	'x-client': `${process.env.HABITICA_USER_ID}-Habitica-Trello`
      },
      body: JSON.stringify({
        type: 'todo',
        text: title,
        notes: notes,
        priority: priority
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
