var TrelloPowerUp = TrelloPowerUp || {}
var _ = _ || {}
var t = TrelloPowerUp.iframe();


$(document).ready(function () {
  $('#clear-votes').click(() => {
    $('#clear-votes-confirmation').show();
    $('#clear-votes').hide();
  });
  
  $('#clear-votes-cancel').click(() => {
    $('#clear-votes-confirmation').hide();
    $('#clear-votes').show();
  });
  
  $('#clear-votes-sure').click(clearAllVotes);
});

function clearAllVotes() {
  var allMembersIds = [];
  var allCardsIds = [];
  return t.board('members')
  .then(board => allMembersIds = board.members.map(m => m.id))
  .then(() => t.cards('id'))
  .then(allCards => allCardsIds = allCards.map(c => c.id))
  .then(() => Promise.all(allCardsIds.map(id => t.set(id, 'shared', 'count', 0))))
  .then(() => Promise.all(
              _.flatten(allCardsIds.map(cardId => allMembersIds.map((memberId => ({cardId: cardId, memberId: memberId})))), true)
              .map(pair => t.set(pair.cardId, 'shared', 'votesByMember.'+pair.memberId, 0))
            )
       )
  .then(() => t.remove('board', 'shared',allMembersIds.map(id => 'membersRemainings.'+id)))
  .then(() => allCardsIds.map(id => t.remove(id, 'shared', allMembersIds.map(mId => 'votes.'+mId))))
  .then(() => t.closePopup())
  .catch(onReject);
}

function onReject(error) {
  console.log(error);
}

t.render(function(){
  var allCardsIds = [];
  var memberThatVoted = [];
  var allMembers = [];
  return t.cards('id')
  .then(allCards => allCardsIds = allCards.map(c => c.id))
  .then(() => Promise.all(allCardsIds.map(cardId => t.get(cardId, 'shared', 'count'))))
  .then(values => {
    var total = _.reduce(values, (memo, num) => memo + num, 0);
    $('#total-count').text(total);
  })
  .then(() => t.board('members'))
  .then(board => {
    allMembers = board.members;
    return Promise.all(allMembers.map(m => m.id).map(id => t.get('board', 'shared', 'membersRemainings.'+id, 3)))
  })
  .then(values => {
    var remainingVotes = _.zip(allMembers, values);
    $('#member-list').empty();
    remainingVotes.sort((a, b) => a[1] == b[1] ? 0 : (a[1]>b[1] ? 1 : -1)).forEach((pair) => {
      var avatar = pair[0]['avatar'];
      var initials = pair[0]['initials'];
      var count = pair[1];
      var icon = avatar ? `<img class='avatar-img' src=${avatar}>` : `<span class='initials'>${initials}</span>`      
      $('#member-list').append(`<li>${icon} <span class='stars'>${Array.apply(null, Array(count)).map(_ => "<span class='star-icon available'></span>").join('')}${Array.apply(null, Array(3-count)).map(_ => "<span class='star-icon unavailable'></span>").join('')}</span></li>`)
    });
  })
  .then(() => t.sizeTo('#control-panel').done())

  .catch(onReject);
});