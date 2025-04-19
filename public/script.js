window.TrelloPowerUp.initialize({
  appKey: 'TRELLO_APP_KEY', // Get from https://trello.com/app-key
  appName: 'Habitica Sync',

  'card-buttons': (t) => [{
    icon: 'https://habitica.com/favicon.ico',
    text: 'Sync to Habitica',
    callback: async (t) => {
      const card = await t.card('name', 'desc');
      await triggerGitHubSync(card);
      t.closePopup().then(() => {
        t.alert({ message: 'Task queued for sync!' });
      });
    }
  }]
});

async function triggerGitHubSync(card) {
  const response = await fetch(
    'https://api.github.com/repos/Bunny-Burrow/Habitica-Trello/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer YOUR_GITHUB_PAT`, // Fine-grained PAT with "workflow" scope
        Accept: 'application/vnd.github.everest-preview+json',
      },
      body: JSON.stringify({
        event_type: 'trello-to-habitica-sync',
        client_payload: {
          card_id: card.id,
          card_name: card.name,
          card_desc: card.desc
        }
      })
    }
  );
  if (!response.ok) throw new Error('Sync failed');
