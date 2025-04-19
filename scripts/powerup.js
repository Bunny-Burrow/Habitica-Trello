// Power-Up logic placeholder
//

/* globals TrelloPowerUp */

const t = TrelloPowerUp.iframe();
console.log("Trello Power-Up Loaded");
window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [
      {
        icon: 'https://habitica.com/favicon.ico',
        text: 'Set Difficulty',
        callback: function (t) {
          return t.popup({
            title: 'Select Difficulty',
            url: './public/difficulty-selector.html',
            height: 120
          });
        }
      },
      {
        icon: 'https://habitica.com/favicon.ico',
        text: 'Sync to Habitica',
        callback: function (t) {
          return Promise.all([
            t.card('name'),
            t.get('member', 'private', 'habiticaApiToken'),
            t.get('member', 'private', 'habiticaUserId'),
            t.get('card', 'shared', 'habiticaDifficulty')
          ]).then(([card, apiToken, userId, difficulty]) => {
            if (!apiToken || !userId) {
              alert("Please authorize with Habitica first.");
              return;
            }

            const priority = difficulty === 'hard' ? 2 : (difficulty === 'easy' ? 0.1 : 1);

            fetch('https://habitica.com/api/v3/tasks/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-user': userId,
                'x-api-key': apiToken
              },
              body: JSON.stringify({
                type: 'todo',
                text: card.name,
                priority
              })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                // Store Habitica task ID in card storage
                t.set('card', 'shared', 'habiticaTaskId', data.data.id);
                alert('Card synced to Habitica!');
              } else {
                console.error(data);
                alert('Failed to sync. Check API token or user ID.');
              }
            });
          });
        }
      }
    ];
  }
});

