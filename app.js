const express= require('express')
const app =express();
const PORT=4000|| process.env.PORT;
const path=require('path');

const server = app.listen(PORT,()=>{
console.log("program running on port ",PORT);
});

app.use(express.static(path.join(__dirname,'public')))

const io=require('socket.io')(server);

let socketsConnected=new Set();

io.on('connection',onConnected);

function onConnected(socket){
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('client-total',socketsConnected.size);

    socket.on('disconnect',()=>{

        console.log('disconnected')
        socketsConnected.delete(socket.id);
        io.emit('client-total',socketsConnected.size);

    });


//      <li class="message-feedback">
//     <p class="feedback" id="feedback">
//         killer is typing
//     </p>
// </li> 
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback',(data)=>{

        socket.broadcast.emit('feedback',data)

    })
}



