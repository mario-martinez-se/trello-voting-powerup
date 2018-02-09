var t = TrelloPowerUp.iframe();


window.reset.addEventListener('click', function(){
  return t.get
});

window.vote.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  var selectedVote = $('#voteNumber').val();
  return t.get('member', 'shared', 'remaining', 3)
  .then(function(remaining) {
    return t.set('member', 'shared', 'remaining', remaining - selectedVote);
  })
  .then(function() {
    return t.get('card', 'shared', 'vote', 0);
  })
  .then(function(currentCount) {
    return t.set('card', 'shared', 'vote', currentCount + selectedVote);
  })
  .then(function() {
    return t.set('card', 'shared',)
  })
  .then(function() {
    t.closePopup();
  });
});

t.render(function(){
  return t.get('member', 'shared', 'remaining', 3)
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