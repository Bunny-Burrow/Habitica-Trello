window.TrelloPowerUp.initialize({
  appKey: 'YOUR_TRELLO_APP_KEY', // Replace with your key
  appName: 'Habitica Sync',

  'card-buttons': (t) => [{
    icon: 'https://habitica.com/favicon.ico',
    text: 'Sync to Habitica',
    callback: async (t) => {
      const card = await t.card('name', 'desc', 'id');
      const response = await fetch(
        'https://api.github.com/repos/YOUR_USER/YOUR_REPO/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await t.loadSecret('github-pat')}`,
            Accept: 'application/vnd.github.everest-preview+json'
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
      if (response.ok) {
        t.closePopup().then(() => {
          t.alert({ message: 'Synced to Habitica!' });
        });
      }
    } // Close callback
  }] // Close array
}); // Close initialize
