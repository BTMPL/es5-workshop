function hijackConsole() {

  var _consoleLog = console.log;

  console.log = function(input) {
    document.getElementById('console').innerHTML += '<li>' + (typeof input) + ': ' +(typeof input === 'undefined' ? 'undefined' : input) + '</li>';
    _consoleLog(input);
  }
}

function searchImage(str, result) {

  if(!str) {
    result.call(this, null, 'Prosimy wpisać wyszukiwany tekst');
    return;    
  }

  jQuery.ajax('https://pixabay.com/api/?key=8985717-55d103b88c92b01250afba01d&q='+str+'&image_type=photo').done(function(data) {
    result.call(this, data.hits.map(function(i) {
      return {
        url: i.webformatURL,
        name: i.tags
      }
    }));
  })
}