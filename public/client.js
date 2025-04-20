window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://cdn-icons-png.flaticon.com/512/545/545705.png',
      text: 'Sync to Habitica',
      callback: function (t) {
        return t.popup({
          title: 'Habitica Sync',
          url: 'index.html', // opens the popup form hosted at root
          height: 250
        });
      }
    }];
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById('sync-form');
  const status = document.getElementById('status');

  if (!form) return; // not inside popup, skip this code

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.innerText = "🔄 Syncing...";

    const difficulty = document.getElementById('difficulty').value;

    // Access Trello popup context
    const t = window.TrelloPowerUp.iframe();
    const card = await t.card('name', 'desc');

    try {
      const response = await fetch('/api/habitica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: card.name,
          notes: card.desc,
          priority: difficultyToPriority(difficulty)
        })
      });

      const result = await response.json();

      if (response.ok) {
        status.innerText = '✅ Synced to Habitica!';
      } else {
        status.innerText = `❌ Failed: ${result.message || result.error}`;
      }
    } catch (err) {
      status.innerText = `❌ Sync error: ${err.message}`;
    }
  });

  function difficultyToPriority(diff) {
    switch (diff.toLowerCase()) {
      case 'trivial': return 0.1;
      case 'easy': return 1;
      case 'medium': return 1.5;
      case 'hard': return 2;
      default: return 1;
    }
  }
});
