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
  
  return Promise.all([t.getAll(), t.board('members'), t.cards('id', 'name', 'shortLink')])
  .then(values => {
    var allMembers = values[1].members;
    var allVotes = values[0].board.shared;
    var allCards = values[2];

    var topCards = Object.keys(allVotes).map(key => ({key: key, votes:allVotes[key]})).sort((a, b) => a.votes == b.votes ? 0 : (a.votes <b.votes ? 1 : -1)).slice(0, 3).map(pair => pair.key.split('.')[1]).map(cardId => allCards.find(card => cardId == card.id)).filter(card => card !== undefined)
    var totalCount = _.reduce(Object.keys(allVotes).map(key => allVotes[key]), (x, y)=> x + y, 0);
    var remaingVotesPerMember = _.zip(allMembers , allMembers.map(member => Object.keys(allVotes).map(key => ({memberId: key.split('.')[2], votes:allVotes[key]})).filter(pair => pair.memberId == member.id)).map(array => _.reduce(array, (memo, pair) => memo + pair.votes, 0)).map(voted => 3 - voted)).sort((a, b) => a[1] == b[1] ? 0 : (a[1]>b[1] ? 1 : -1))
    
    $('#top-cards').empty();
    $('#member-list').empty();
    
    
    $('#total-count').text(totalCount);
    
    topCards.forEach(cardData => {
      $('#top-cards').append(`<li><a class="card-link" data-shortlink="${cardData.shortLink}" href="javascript:void(0);">${cardData.name}</li>`)
    });
    
    remaingVotesPerMember.forEach((pair) => {
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