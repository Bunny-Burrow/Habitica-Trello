window.TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://cdn-icons-png.flaticon.com/512/545/545705.png',
      text: 'Check & Sync',
      callback: async function (t) {
        const card = await t.card('id', 'name', 'desc', 'idList');
        const list = await t.list('name');

        const lastList = await t.get('card', 'shared', 'lastList');
        const synced = await t.get('card', 'shared', 'habiticaSynced');
        const habiticaTaskId = await t.get('card', 'shared', 'habiticaTaskId');

        await t.set('card', 'shared', 'lastList', list.name); // Store current list

        // === MOVED TO DOING ===
        if (list.name === 'Doing' && lastList !== 'Doing' && !synced) {
          return t.popup({
            title: 'Habitica Difficulty',
            url: 'index.html',
            height: 250
          });
        }

        // === MOVED TO DONE ===
        if (list.name === 'Done' && synced) {
          const response = await fetch('/api/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              taskId: habiticaTaskId,
              title: card.name
            })
          });

          const result = await response.json();

          if (response.ok) {
            await t.set('card', 'shared', {
              habiticaSynced: false,
              habiticaTaskId: null
            });
            alert('✅ Habitica task marked as complete!');
          } else {
            alert(`❌ Failed to complete task: ${result.message || result.error}`);
          }
        }

        return t.closePopup();
      }
    }];
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('sync-form');
  const status = document.getElementById('status');

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    status.innerText = "🔄 Syncing with Habitica...";

    const difficulty = document.getElementById('difficulty').value;
    const t = window.TrelloPowerUp.iframe();
    const card = await t.card('name', 'desc');

    try {
      const response = await fetch('/api/habitica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: card.name,
          notes: card.desc,
          priority: difficultyToPriority(difficulty)
        })
      });

      const result = await response.json();

      if (response.ok) {
        await t.set('card', 'shared', {
          habiticaSynced: true,
          habiticaTaskId: result.data.id,
          habiticaDifficulty: difficulty
        });
        status.innerText = '✅ Synced to Habitica!';
      } else {
        status.innerText = `❌ Error: ${result.message || result.error}`;
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