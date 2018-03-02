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
  .then(() => t.remove('board', 'shared',allMembersIds.map(id => 'membersRemainings.'+id)))
  .then(() => t.getAll())
  .then(data => t.remove('board', 'shared', Object.keys(data.board.shared)))
  
  .then(() => t.closeModal())  
  .catch(onReject);
}

function onReject(error) {
  console.log(error);
}

t.render(function(){
  var allCards = [];
  var memberThatVoted = [];
  var allMembers = [];
  var allCount = [];
  return t.cards('id', 'name', 'shortLink')
  .then(cards => {
    allCards = cards;
  })
  .then(() => Promise.all(allCards.map(card => t.get(card.id, 'shared', 'count', 0))))
  .then(values => {
    allCount = values;
    var total = _.reduce(values, (memo, num) => memo + num, 0);
    $('#total-count').text(total);
  })
  .then(() => t.board('members'))
  .then(board => {
    allMembers = board.members;
    return Promise.all(allMembers.map(m => m.id).map(id => t.get('board', 'shared', 'membersRemainings.'+id, 3)))
  })
  .then(values => {
    $('#top-cards').empty()
    var sortedCards = _.zip(allCards, allCount).sort((a, b) => a[1] == b[1] ? 0 : (a[1]<b[1] ? 1 : -1)).map(pair => ({shortLink: pair[0]['shortLink'],name:pair[0]['name']}));
    sortedCards.slice(0, 3).forEach(cardData => {
      $('#top-cards').append(`<li><a class="card-link" data-shortlink="${cardData.shortLink}" href="javascript:void(0);">${cardData.name}</li>`)
    });
    
    $('.card-link').click((event) => {
      t.showCard($(event.target).data('shortlink'));
    });
    
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