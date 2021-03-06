/* global TrelloPowerUp */
var _ = _ || {}

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
	'card-buttons': function(t, options) {
		return [{
			icon: "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite.png?1519391551505",
			text: 'Vote!',
      callback: function(t) {
      return t.popup({
        title: "Vote",
        url: 'vote.html',
      });
	}
		}];
	},
  'board-buttons': function(t, options) {
    return [{
      icon: "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite_half.png?1519394247923",
      text: 'Votes control',
      callback: function(t) {
        return t.modal({
          title: "Votes Control Panel",
          url: 'votes_control.html'
        });
      }
    }];
  },
  'card-badges': function(t, options) {
    return Promise.all([t.card('id'), t.getAll()])
    .then(values => {
      var cardId = values[0].id
      var allVotes = values[1].board.shared
      
      var count = _.reduce(Object.keys(allVotes).filter(key => key.split('.')[1] == cardId).map(key => allVotes[key]), (x, y)=> x + y,0);
      return [{
        icon: count > 0 ? "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite_black.png?1519393882625" : "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite.png?1519391551505",
        text: count || '0',
        color: 'black',
      }];
    });
  }
});
