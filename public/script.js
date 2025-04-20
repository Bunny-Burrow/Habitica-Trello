window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      icon: 'https://habitica.com/favicon.ico',
      text: 'Sync to Habitica',
      callback: async (t) => {
        const card = await t.card('name', 'desc');
        console.log("Card synced:", card.name);
      }
    }];
  }
});
