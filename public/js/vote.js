var TrelloPowerUp = TrelloPowerUp || {}

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
      var position = Number($(event.target).attr('id').split('vote-')[1]);
      var count = 0;
      $('.voting-button.available').each((_, item) => {
        var itemPosition = Number($(item).attr('id').split('vote-')[1]);
        if (itemPosition <= position) {
          count ++;
        }
      });
      return vote(count);
    } else if ($(event.target).hasClass('voted')) {
      var position = Number($(event.target).attr('id').split('vote-')[1]);
      var count = 0;
      $('.voting-button.voted').each((_, item) => {
        var itemPosition = Number($(item).attr('id').split('vote-')[1]);
        if (itemPosition >= position) {
          count ++;
        }
      });
      return vote(count * -1);
    }
  });
});

function vote(selectedVote) {
  var memberId;
  var cardId;
  return t.member('id')
  .then((member) => {
    memberId = member.id;
    return t.get('board', 'shared', 'membersRemainings.'+memberId, 3);
  })
  .then(remaining => t.set('board', 'shared', 'membersRemainings.'+memberId, remaining - selectedVote ))
  .then(() =>t.get('card', 'shared', 'count', 0))
  .then(currentCount => t.set('card', 'shared', 'count', currentCount + selectedVote))
  .then(() => t.card('id'))
  .then(card => cardId = card.id)
  .then(() => t.get('card', 'shared', `votesInCardByMember.${cardId}.${memberId}`, 0))
  .then(membersVotesInThisCard => t.set('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, membersVotesInThisCard + selectedVote))
  .then(() => t.closePopup());
}

t.render(function(){
  return Promise.all([t.member('id'), t.card('id')])
  .then(values => Promise.all([t.get('board','shared', 'membersRemainings.'+ values[0].id, 3), t.get('board','shared', `votesInCardByMember.${values[1].id}.${values[0].id}`, 0)]))
  .then(values => {
    var available = values[0];
    var voted = values [1];
    var array = Array.apply(null, Array(voted)).map((_) => 'voted').concat(Array.apply(null, Array(available)).map((_) => 'available'));
    if (array.length <= 3) {
      array = array.concat(Array.apply(null, Array(3-array.length)).map((_) => 'unavailable'));
      array.forEach((css, i) => $('#vote-'+(i+1)).addClass(css));
    }
    t.sizeTo('#button-set').done();
  })
});