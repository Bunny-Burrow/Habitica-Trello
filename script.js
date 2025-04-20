const t = TrelloPowerUp.iframe();

window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      icon: 'https://habitica.com/favicon.ico',
      text: 'Sync to Habitica',
      callback: async (t) => {
        const card = await t.card('name', 'desc', 'url', 'idList');
        const lists = await t.lists('id', 'name');
        const list = lists.find(l => l.id === card.idList);

        await fetch('https://habitica-trello-sync.glitch.me/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cardName: card.name,
            cardDesc: card.desc,
            cardURL: card.url,
            listName: list?.name || ''
          })
        });

        return t.alert({ message: 'Sync sent to Habitica!' });
      }
    }];
  }
});
