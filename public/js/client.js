/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var GREY_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717';
var WHITE_ROCKET_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Fwhite-rocket-ship.png?1495811896182';
var BLACK_ROCKET_ICON = 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421';

TrelloPowerUp.initialize({
  // Start adding handlers for your capabilities here!
	'card-buttons': function(t, options) {
		return [{
			icon: BLACK_ROCKET_ICON,
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
      icon: BLACK_ROCKET_ICON,
      text: 'Reset all votes',
      callback: function(t) {
        var allMembersIds = [];
        var allCardsIds = [];
        return t.cards('id')
        .then(() => t.board('members'))
        .then(board => allMembersIds = board.members.map(m => m.id))
        .then(() => t.cards('id'))
        .then(allCards => allCardsIds = allCards.map(c => c.id))
        .then(() => Promise.all(allCardsIds.map(id => t.set(id, 'shared', 'vote', 0))))
        .then(() => t.remove('board', 'shared',allMembersIds.map(id => 'membersRemainings.'+id)))
        .then(() => allCardsIds.map(id => t.remove(id, 'shared', allMembersIds.map(mId => 'votes.'+mId))))
        
        .then(() => t.getAll().then(data => console.log(data)))
      }
    }];
  }
  // 'card-badges': function(t, options) {
  //   return t.get('card', 'shared', 'estimate')
  //   .then(function(estimate) {
  //     return [{
  //       icon: estimate ? GREY_ROCKET_ICON : WHITE_ROCKET_ICON,
  //       text: estimate || 'No Estimate!',
  //       color: estimate ? null : 'red',
  //     }];  
  //   });
  // },
  // 'card-detail-badges': function(t, options) {
  //   return t.get('card', 'shared', 'estimate')
  //   .then(function(estimate) {
  //     return [{
  //       title: 'Estimate',
  //       text: estimate || 'No Estimate!',
  //       color: estimate ? null : 'red',
  //       callback: function(t) {
  //         return t.popup({
  //           title: "Estimation",
  //           url: 'estimate.html',
  //         });
  //       }
  //     }]
  //   });
  // }
});
