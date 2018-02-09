var t = TrelloPowerUp.iframe();

window.vote.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  //return t.set('card', 'shared', 'vote', window.voteNumber.value)
  return t.get('member', 'shared', 'remaining', 3)
  .then(function(remaining){
    
  })
  .then(function(){
    t.closePopup();
  });
});

t.render(function(){
  return t.get('card', 'shared', 'vote')
  .then(function(vote){
    window.voteNumber.value = vote;
  })
  .then(function(){
    t.sizeTo('#vote').done();
  });
});