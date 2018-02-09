var t = TrelloPowerUp.iframe();


window.reset.addEventListener('click', function(){
  var votedByMember = 0;
  var memberId;
  return t.member('id')
  // .then(member => memberId = member.id)
  // .then(() => t.get('card', 'shared', 'votes.' + memberId, 0))
  // .then(votes => {
  //   votedByMember = votes
  // })
  // .then(() => t.get('card', 'shared', 'vote', 0))
  // .then(count => {
  //   t.set('card', 'shared', 'vote', count - votedByMember)
  //  })
  // .then(() => t.get('board', 'shared', 'membersRemainings.' + memberId, 3))
  // .then(memberRemaining => {
  //   t.set('board', 'shared', 'membersRemainings.' + memberId, memberRemaining + votedByMember)
  // })
  // .then(() => t.set('card', 'shared', 'votes.'+memberId, 0))
});

window.vote.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  var selectedVote = $('#voteNumber').val();
  var memberId;
  return t.member('id')
  .then((member) => {
    memberId = member.id;
    return t.get('board', 'shared', 'membersRemainings.'+memberId, 3);
  })
  .then(remaining => t.set('board', 'shared', 'membersRemainings.'+memberId, remaining - selectedVote ))
  .then(() =>t.get('card', 'shared', 'vote', 0))
  .then(currentCount => t.set('card', 'shared', 'vote', currentCount + selectedVote))
  .then(() => t.get('card', 'shared', 'votes.'+memberId, 0))
  .then(membersVotesInThisCard => t.set('card', 'shared', 'votes.'+memberId, membersVotesInThisCard + selectedVote))
  .then(() => t.closePopup());
});

t.render(function(){
  var memberId;
  return t.member('id')
  .then(function(member) {
    memberId = member.id;
    return t.get('board','shared', 'membersRemainings.'+memberId, 3);
  })
  .then(function(remaining) {
    console.log(remaining);
    var options = [];
    for (var i = 0; i < remaining; i++) {
      options.push(i+1);
    }
    return options;
  })
  .then(function(availableOptions){
    $('#voteNumber option').attr('disabled','disabled');
    for (var i=0; i<availableOptions.length; i++) {
      $('#voteNumber option[value="'+ availableOptions[i] +'"]').removeAttr('disabled');
    }
    t.sizeTo('#vote').done();
  });
});