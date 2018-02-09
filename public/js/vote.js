var t = TrelloPowerUp.iframe();

window.vote.addEventListener('submit', function(event){
  // Stop the browser trying to submit the form itself.
  event.preventDefault();
  //return t.set('card', 'shared', 'vote', window.voteNumber.value)
  t.closePopup();
});

t.render(function(){
  return t.get('member', 'shared', 'remaining', 3)
  .then(function(remaining){
    var options = [];
    for (var i = 0; i < remaining; i++) {
      options.push(i+1);
    }
    
    return options;
  })
  .then(function(){
    $('')
  })
  .then(function(){
    t.sizeTo('#vote').done();
  });
});