window.TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      icon: 'https://cdn-icons-png.flaticon.com/512/545/545705.png',
      text: 'Sync to Habitica',
      callback: function (t) {
        return t.popup({
          title: 'Habitica Sync',
          url: 'https://habitica-trello.vercel.app//',
        });
      }
    }];
  }
});
