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
        return t.popup({
          title: "Votes Control",
          url: 'votes_control.html'
        });
        // var allMembersIds = [];
        // var allCardsIds = [];
        // return t.cards('id')
        // .then(() => t.board('members'))
        // .then(board => allMembersIds = board.members.map(m => m.id))
        // .then(() => t.cards('id'))
        // .then(allCards => allCardsIds = allCards.map(c => c.id))
        // .then(() => Promise.all(allCardsIds.map(id => t.set(id, 'shared', 'count', 0))))
        // .then(() => Promise.all(
        //             _.flatten(allCardsIds.map(cardId => allMembersIds.map((memberId => ({cardId: cardId, memberId: memberId})))), true)
        //             .map(pair => t.set(pair.cardId, 'shared', 'votesByMember.'+pair.memberId, 0))
        //           )
        //      )
        // .then(() => t.remove('board', 'shared',allMembersIds.map(id => 'membersRemainings.'+id)))
        // .then(() => allCardsIds.map(id => t.remove(id, 'shared', allMembersIds.map(mId => 'votes.'+mId))))
      }
    }];
  },
  'card-badges': function(t, options) {
    return t.get('card', 'shared', 'count', 0)
    .then(function(count) {
      return [{
        icon: count > 0 ? "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite_black.png?1519393882625" : "https://cdn.glitch.com/d0d3d13a-bb36-42f5-837a-10a11a05b28c%2Ffavorite.png?1519391551505",
        text: count || '0',
        color: 'black',
      }];  
    });
  },
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
