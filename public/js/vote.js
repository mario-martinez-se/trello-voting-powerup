  var TrelloPowerUp = TrelloPowerUp || {}
var _ = _ || {}

var t = TrelloPowerUp.iframe();

$(document).ready(function () {
  $('.voting-button').mouseover((event) => {
    if (!$(event.target).hasClass('unavailable')) {
      var position = Number($(event.target).attr('id').split('vote-')[1]);
      Array.apply(null, Array(position)).map((_, i) => i).forEach(i => $('#vote-'+(i+1)).addClass('active'));
    }
  }).mouseleave((event) => {
    var position = Number($(event.target).attr('id').split('vote-')[1]);
    Array.apply(null, Array(position)).map((_, i) => i).forEach(i => $('#vote-'+(i+1)).removeClass('active'));
  }).click((event) => {
    if ($(event.target).hasClass('available')) {
      $('.voting-button').prop('disabled', true);
      var position = Number($(event.target).attr('id').split('vote-')[1]);
      var count = 0;
      $('.voting-button.available').each((_, item) => {
        var itemPosition = Number($(item).attr('id').split('vote-')[1]);
        if (itemPosition <= position) {
          count ++;
        }
      });
      return vote(count).then(() => $('.voting-button').prop('disabled', false).removeClass('active'));
    } else if ($(event.target).hasClass('voted')) {
      $('.voting-button').prop('disabled', true);
      var position = Number($(event.target).attr('id').split('vote-')[1]);
      var count = 0;
      $('.voting-button.voted').each((_, item) => {
        var itemPosition = Number($(item).attr('id').split('vote-')[1]);
        if (itemPosition >= position) {
          count ++;
        }
      });
      return vote(count * -1).then(() => $('.voting-button').prop('disabled', false).removeClass('active'));
    }
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setVote(cardId, memberId, value) {
  return repeatSetValue(cardId, memberId, value, 5);
}

/*
  Recursively, tries to set value the number of attempts provided. It will add a delay that increases between attempts.
*/
function repeatSetValue(cardId, memberId, value, attempts) {
  if (attempts > 0) {
    return Promise.resolve(setValueInCardForMember(cardId, memberId, value))
    .then(currentValue => currentValue === value ? true : sleep(3000/(attempts+1)).then(() => repeatSetValue(cardId, memberId, value, attempts -1 )))
  } else {
    return Promise.resolve(false);
  }
}

/*
  Sets the value in the card for the member and returns the value currently set.
*/
function setValueInCardForMember(cardId, memberId, value) {
  return Promise.resolve(t.set('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, value))
  .then(() => t.get('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, 0))
}

function vote(selectedVote) {
  var memberId;
  var cardId;
  return t.member('id')
  .then((member) => memberId = member.id)
  .then(() => t.card('id'))
  .then(card => cardId = card.id)
  .then(() => t.get('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, 0))
  .then(membersVotesInThisCard => setVote(cardId, memberId, membersVotesInThisCard + selectedVote))
  .then(success => success ? t.closePopup() : null);
}

t.render(function(){
  
  return Promise.all([t.member('id'), t.card('id'), t.getAll()])
  .then(values => {
    var memberId = values[0].id;
    var cardId = values[1].id;
    
    var allVotes = values[2].board.shared
    
    var totalVotedByThisMember = _.reduce(Object.keys(allVotes).filter(key => key.split('.')[2] == memberId).map(key => allVotes[key]), (x, y)=> x + y,0);
    var votedByThisMemberInThisCard = allVotes[`votesInCardByMember.${cardId}.${memberId}`] || 0;
    var available = 3 - totalVotedByThisMember;
    
    var array = Array.apply(null, Array(votedByThisMemberInThisCard)).map((_) => 'voted').concat(Array.apply(null, Array(available)).map((_) => 'available'));
    if (array.length <= 3) {
      array = array.concat(Array.apply(null, Array(3-array.length)).map((_) => 'unavailable'));
      array.forEach((css, i) => $('#vote-'+(i+1)).addClass(css));
    }
    t.sizeTo('#button-set').done();
  })
});