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
  return t.cards('id')
  .then(() => t.board('members'))
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