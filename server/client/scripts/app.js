
//To Do//

//be able to add messages to specific chat rooms

//have messages auto refresh

var app = {};

app.server = 'http://localhost:3000/classes/messages';

//raw data gatherd on initialization
//this currentData variable will be updated on each fetch
var currentData;
var currentRoom = 'Homeroom';

var newRooms = {};  





//modularize a bit more here
app.fetch = function (callback) {
  $.ajax({
  url: app.server,
  type: 'GET',
  contentType: 'application/json',
  success: function (data) {
    //take a callback and do something with the fetched data
    data = JSON.parse(data);
    if (callback) {
      callback(data);
    }

    currentData = data.results;
  },
  error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }

})

}

app.post = function (message) {

  $.ajax({
  url: app.server,
  type: 'POST',
  data: message,
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
    // app.fetch();
    app.refresh(currentData);
  },
  error: function (data) {
    console.error('chatterbox: Failed to send message');
  }
  });

}
//initialize
app.createPage = function () {

  app.fetch(app.init);

}

app.init = function (data) {  
  var rooms = _.uniq(_(data.results).map(function (message) {
    return message.roomname;
  }));
  var messages = data.results;
  
  //add the rooms to the page
  _(rooms).each(function (room) {
    $('.channels').append(app.createElement(room, true));
  });

  //add the messages to the page
  _(messages).each(function (message) {
    $('.messages').append(app.createElement(message, false))
  });

}

app.createElement = function (rawMessage, bool) {
  var newDiv = $('<div></div>');

  if (bool === true) {
    newDiv.attr('class', 'room');
    newDiv.attr('id', rawMessage)
    newDiv.text(rawMessage);

  } else {
    var usernameLink = $('<a></a>');
    var userName = rawMessage.username;
    var message = rawMessage.text;
    usernameLink.text(userName)
    newDiv.attr('class', 'message');

    newDiv.text( userName + ":     " + message);
  }

  return newDiv;
}


//appends all the rooms and messages initially





app.refresh = function (data) {

  var room = currentRoom;
  $('.messages').empty();

  _.each(data, function (message) {
    if (currentRoom === 'Homeroom') {
      $('.messages').append(app.createElement(message, false));
    }
    else if (message.roomname === currentRoom) {
      $('.messages').append(app.createElement(message, false));
    }
    
  })
  //use app get to get the data and re append it 

}


app.selectRoom = function (data) {
  $('.messages').empty('');

  _(currentData).each(function (message) {
    if (message.roomname === currentRoom) {
      $('.messages').prepend(app.createElement(message), false);
    }
  }); 
}



app.send = function (message) {

  app.post(message);

}


$(document).ready(function () {
//send clickhandler
  //add a roomname to add to
  //add a username to add to
  $('.enter').on('click', function (data) {

    var usernameOrMessage = $(data.toElement).text()
    var entered = $('.send').val(); 
    $('.send').val('');

    if (usernameOrMessage === 'Enter username') {
      //append current username
      $('.currentUser').text(entered);
      //change enter button to enter message
      $('.enter').text('Send Message');

    } else {
    var currentUser = $('.currentUser').text();

    var message = {
    username: currentUser,
    text: entered,
    roomname: currentRoom
    };

    app.send(JSON.stringify(message));  
    }

  })

//selecting a room clickhandler
//need to make sure that we are only updating the individual room channels

  $('.channels').on('click', function (data) {

    currentRoom = $(data.toElement).attr('id');
    $('.selectedRoom').text(currentRoom);
    app.selectRoom(data);
    
    })

  $('.newRoom').on('click', function (data) {
    var newRoom = $('.enterRoom').val();
    console.log(typeof newRoom)
    $('.channels').prepend(app.createElement(newRoom, true));
  })  




app.createPage();


setInterval(function () {

  app.fetch();
  app.refresh(currentData);

}, 5000)

})















