
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

// var data = [
//     {name: "WP", message: "Hi"},
//     {name: "ZC", message: "Hello"},
// ];

var dbUrl = 'mongodb://localhost:27017/demochat'
var Message = mongoose.model('Message', {
        name: String,
        message: String,
    }
)

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/message', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
});

app.post('/message', async (req, res) => {
    try { 
        var message = new Message(req.body)
        await message.save()

        var censored =  await Message.findOne({'message': 'badword'})
        if(censored)
            await Message.deleteOne({_id: censored._id})
        else 
            io.emit('io-message', req.body)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error);
    }
    finally {
        console.log('Message post called');
    }
});

io.on("connection", (socket) => {
    console.log("One user is connected");
})


// mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true } ,(err) => {
//     console.log('MongoDB is successfully connected');
// })

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => console.log('MongoDB is successfully connected'),
    err => console.log('Connection is occured ', err)
);
var server = http.listen(3000, () => {
    console.log("Server is listen on port", server.address().port);
})