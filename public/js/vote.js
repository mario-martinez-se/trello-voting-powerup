var t = TrelloPowerUp.iframe();


window.reset.addEventListener('click', function(){
  // TODO!!
  // var votedByThisMember = 0;
  // return t.member('id')
  // .then(function(memberId) {
  //   return t.get('card', 'shared', memberId, 0);
  // })
  // .then(function(memberVotes) {
  //   votedByThisMember = memberVotes;
  //   return t.get('member', 'shared', 'remaining', 0);
  // })
  // .then(function(currentRemaining) {
  //   return t.set('member', 'shared', 'remaining', currentRemaining + votedByThisMember);
  // })
  // .then(function() {
  //   return t.get('card', 'shared', 'vote', 0);
  // })
  // .then(function(currentCount) {
  //   return t.set('card', 'shared', 'vote', currentCount - votedByThisMember);
  // })
});

window.vote.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  var selectedVote = $('#voteNumber').val();
  var memberId;
  return t.member('id')
  .then(function(member) {
    memberId = member.id;
    return t.get('board', 'shared', 'membersRemainings.'+memberId, 3);
  })
  .then(function(remaining) {
    return t.set('board', 'shared', 'membersRemainings.'+memberId, remaining - selectedVote );
  })
  .then(function() {
    return t.get('card', 'shared', 'vote', 0);
  })
  .then(function(currentCount) {
    return t.set('card', 'shared', 'vote', currentCount + selectedVote);
  })
  .then(function() {
    t.closePopup();
  });
});

t.render(function(){
  var memberId;
  return t.member('id')
  .then(function(member) {
    memberId = member.id;
    return t.get('board','shared', 'membersRemainings.'+memberId, 3);
  })
  .then(function(remaining) {
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