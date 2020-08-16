### Improved Code (step by step)

`Nested callback`

```js
    app.post('/message', (req, res) => {
        var message = new Message(req.body)
        message.save((err) => {
            if (err)
                res.sendStatus(200)
            Message.findOne({'message': 'badword'}, (err, censored) => {
                if (censored)
                    Message.deleteOne({'_id': censored._id}, (err) => {
                        console.log("Censored message is removed")
                    })
            })
            io.emit('io-message', req.body)
            res.sendStatus(200)
        })
    })
```

`Using promise`

```js
    app.post('/message', (req, res) => {
        var message = new Message(req.body)
        message.save()
        .then(() => {
            return  Message.findOne({'message': 'badword'})
        })
        .then(censored => {
            if(censored)
                return Message.deleteOne({_id: censored._id})
            io.emit('io-message', req.body)
            res.sendStatus(200)
        })
        .catch(err => {
            res.sendStatus(500);
            return console.error(err)
        })
    })
```

`Using async/await`

```js
    app.post('/message', async (req, res) => {
        var message = new Message(req.body)
        await message.save()

        var censored =  await Message.findOne({'message': 'badword'})
        if(censored)
            await Message.deleteOne({_id: censored._id})
        else 
            io.emit('io-message', req.body)
        res.sendStatus(200)
    })
```