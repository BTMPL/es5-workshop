/**
 * (Nie pełny) przykład komunikacji AJAX.
 *
 * var xml = new XMLHttpRequest();
 * xml.open('GET', 'http://example.com');
 * xml.onreadystatechange = function() {
 *   if(xml.readyState == 4) {
 *     console.log(xml)  
 *   }
 * }
 * xml.send();
 * 
*/

function get(url, success) {
  var xml = new XMLHttpRequest();
  xml.open('GET', url);
  xml.onreadystatechange = function() {
    if(xml.readyState == 4) {
      success.call(undefined, xml.responseText);
    }
  }
  xml.send();  
}

function post(url, data, success) {
  var xml = new XMLHttpRequest();
  xml.open('POST', url);
  xml.setRequestHeader('Content-Type', 'application/json');
  xml.onreadystatechange = function() {
    if(xml.readyState == 4) {
      success.call(undefined, xml.responseText);
    }
  }
  xml.send(JSON.stringify(data));  
}

function renderUI(title) {
  try {
    document.getElementById('layout').remove();
  } catch (e) {

  }
  var parent = document.createElement('div');
  parent.id = 'layout';
  var h4 = document.createElement('h4');
  h4.innerText = title;  
  parent.appendChild(h4);
  document.body.appendChild(parent);
  return parent;
}

function renderPosts(posts, target) {
  for(var i = 0 ; i < posts.length ; i++) {
    if (i === 5) {
      break;
    }
    var li = document.createElement('li');
    li.innerText = posts[i].title;
    (function() {
      var id = posts[i].id;
      li.addEventListener('click', function() {
        window.location.hash = 'post/' + id;
      })
    })()
    target.appendChild(li);    
  }
}

function loadIndex() {
  var parent = renderUI('Na blogu');
  var ul = document.createElement('ul');
  ul.id = 'blogList';
  parent.appendChild(ul);

  get('http://vps88089.ovh.net:3000/posts', function(data) {
    var list = JSON.parse(data).slice(0, 5);
    renderPosts(list, parent);
  });
}

function loadPost(id) {
  get('http://vps88089.ovh.net:3000/posts/' + id, function(data) {
    var obj = JSON.parse(data);
    var parent = renderUI(obj.title);
    
    var div = document.createElement('div');
    div.id = 'blogContent';
    div.innerHTML = obj.body;
    
    parent.appendChild(div);

    var a = document.createElement('a');
    a.href = '#';
    a.innerText = 'Powrót do listy';
    parent.appendChild(a);

    var h5 = document.createElement('h4');
    h5.innerText = 'Komentarze';
    parent.appendChild(h5);

    loadComments(id, parent, function() {
      loadCommentPrompt(id, parent);
    });
  });  
}

function loadComments(id, parent, callback) {
  get('http://vps88089.ovh.net:3000/comments?postId=' + id, function(data) {
    var comments = JSON.parse(data);

    var ol = document.createElement('ol');
  
    comments.forEach(function(item) {
      var li = document.createElement('li')
      var b = document.createElement('b');
      b.innerText = item.author.split('@')[0];
      var p = document.createElement('p');
      p.innerHTML = item.body;
      
      li.appendChild(b);
      li.appendChild(p);

      ol.appendChild(li);
    })

    parent.appendChild(ol);
    
    if (callback) {
      callback.call();
    }
  });    
}

function loadCommentPrompt(postId, parent) {
  var form = document.createElement('form');

  var submit = document.createElement('input');
  submit.type = 'Submit';
  submit.value = 'Wyślij formularz';

  form.appendChild(document.createElement('textarea'));
  form.appendChild(document.createElement('br'));
  form.appendChild(submit);
  parent.appendChild(form);

  submit.addEventListener('click', function(e) {
    e.preventDefault();
    var text = input.value;
    if (!text) {
      alert('Proszę podać komentarz!');
    } else {
      post('http://vps88089.ovh.net:3000/comments', {
        postId: postId,
        author: 'Bartek@example.com',
        body: text
      }, function() {
        window.location.reload();
      });
    }
  })
}

function router(hash) {
  if (!hash) {
    loadIndex();
  } else {
    loadPost(window.location.hash.replace('#post/', ''));
  }  
}

function init(hash) {
  window.addEventListener('hashchange', function() {
    router(window.location.hash);
  });
  router(window.location.hash);
}