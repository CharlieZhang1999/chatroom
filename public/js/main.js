const chatForm = document.getElementById('chatform');
const chatMessage = document.querySelector('.chatmessages');
const logoutBtn = document.getElementById('leave-btn');
const socket = io();
import moment from 'https://unpkg.com/moment@2.29.1/dist/moment.js';
import MessageView from './MessageView.js';
window.onload = loadMessage;
const user = await getUser();

socket.on('receiveMessage', function(message){
  const div = document.createElement('div');
  div.classList.add("message", "other");
  div.innerHTML =  `
  <div>
    <p class="meta"> ${message.username} <span class="time"> ${message.time} </span></p>
    <p class="text">
    ${message.text}
    </p>
  </div>`
  document.querySelector(".messages").appendChild(div);
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

// socket.on('message', message =>{s
//   outputMessage(message);
//   // Automatically Do the scroll thing
//   chatMessage.scrollTop = chatMessage.scrollHeight;
// })


chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const chatmsg = e.target.elements.msg.value;
  // Emit message to server
  const msg = {
    username: user,
    text: chatmsg
  }
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

  // append locally 
  sendMessage(msg);
  // append to others screen
  socket.emit('chatMessage', msg);
  
  try{
    const res = await axios({
      url: '/api/message',
      method: 'POST',
      headers: {
        'auth-token': sessionStorage.getItem('auth-token')
      },
      data: {
          message: chatmsg
      }
  });
  }catch(err){
    console.log("Error when messaging");
  }
})
async function getUser(){
  try{
    const res = await axios({
      url: '/api/user/userinfo',
      method: 'GET',
      headers: {
        'auth-token': sessionStorage.getItem('auth-token')
      }
    });
    return res.data.username;
  }
  catch(err){
    const error = 'Error';
    return error;
  }
}
async function loadMessage(){
  const parent_div = document.querySelector('.messages');
  try{
    const res = await axios({
      url: '/api/message',
      method: 'GET',
      headers: {
        'auth-token': sessionStorage.getItem('auth-token')
      }
    });
    let data = res.data;
    data.forEach(async(eachMessage) => {
        //append a view of that tweet to the main page
        new MessageView(eachMessage, parent_div, user);
    });
  }
  catch(err){
    console.log('Access Denied!');
  }
  
}

/*
msg: {
  user:
  text:
}
*/
function sendMessage(msg){
  const message = {
    username:msg.username, 
    text:msg.text,
    time:moment(new Date()).format('YYYY/MM/D hh:mm a')
  };
  
  const div = document.createElement('div');
  div.classList.add("message", "my");
  div.innerHTML =  `
  <div>
    <p class="meta"> ${message.username} <span class="time"> ${message.time} </span></p>
    <p class="text">
    ${message.text}
    </p>
  </div>`
  document.querySelector(".messages").appendChild(div);
}

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add("message", "my");
  div.innerHTML =  `
  <div>
    <p class="meta"> ${message.username} <span class="time"> ${message.time} </span></p>
    <p class="text">
    ${message.text}
    </p>
  </div>`
  document.querySelector(".messages").appendChild(div);
}

logoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.replace('/');
  logoutBtn.submit();
})


// const chatForm = document.getElementById('chat-form');
// const chatMessages = document.querySelector('.chat-messages');
// const roomName = document.getElementById('room-name');
// const userList = document.getElementById('users');

// // Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

// const socket = io();

// // Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// // Message from server
// socket.on('message', (message) => {
//   console.log(message);
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// // Message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   // Get message text
//   let msg = e.target.elements.msg.value;

//   msg = msg.trim();

//   if (!msg) {
//     return false;
//   }

//   // Emit message to server
//   socket.emit('chatMessage', msg);

//   // Clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();
// });

// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   const p = document.createElement('p');
//   p.classList.add('meta');
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement('p');
//   para.classList.add('text');
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector('.chat-messages').appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = '';
//   users.forEach((user) => {
//     const li = document.createElement('li');
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

// //Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//   const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//   if (leaveRoom) {
//     window.location = '../index.html';
//   } else {
//   }
// });
