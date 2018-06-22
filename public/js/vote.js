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
      return vote(count);
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
      return vote(count * -1).then(() => $('.voting-button').prop('disabled', false));
    }
  });
});

//TODO: REMOVE
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function vote(selectedVote) {
  var memberId;
  var cardId;
  return t.member('id')
  .then((member) => memberId = member.id)
  .then(() => t.card('id'))
  .then(card => cardId = card.id)
  .then(() => t.get('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, 0))
  //Set the new value and pass along the expected value
  .then(membersVotesInThisCard => 
        Promise.all([
          t.set('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, membersVotesInThisCard + selectedVote),
          membersVotesInThisCard + selectedVote
        ])
       )
  //Get the value again and pass along the expected value
  .then(values => Promise.all([t.get('board', 'shared', `votesInCardByMember.${cardId}.${memberId}`, 0), values[1]]))
  //Check that the new value is properly set
  .then(values => values[0] === values[1])
  //Avoid closing the popUp unless the new value has been accepted
  .then(shouldClosePopUp => shouldClosePopUp ? t.closePopup() : null);
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