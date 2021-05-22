//Backend Server set up
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000; 
//const path = require('path');

//To avoid cors error 
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//I got an error combining two apps 

// frontend is runnig on localhost:3000
// backend is running on localhost:4000

// app.use(express.static(path.join(__dirname, '../build')));
// app.use('/static', express.static(path.join(__dirname, 'build//static')));

//use this to prase the jason
app.use(bodyParser.json());


//Connection with monogoDB data base by using mongoose 
const myConnectionString = 'mongodb+srv://admin:admin2@cluster0.jnlag.mongodb.net/todos?retryWrites=true&w=majority';
mongoose.connect(myConnectionString, { useNewUrlParser: true });

//Schema defined for the data stored in mongodb
const Schema = mongoose.Schema;

let todoSchema = new Schema({
    todo_description: {
        type: String
    },
    todo_responsible: {
        type: String
    },
    todo_priority: {
        type: String
    },
    todo_completed: {
        type: Boolean
    }
});
//create model for database
const Todo = mongoose.model('Todo', todoSchema);


//Routing Point listening for get request

app.get('/', (req, res) => {
    Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
//Routing point listening for get request
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    Todo.findById(id, function (err, todo) {
        res.json(todo);
    });
});
//Route point listening for post request
app.post('/todos/add', (req, res) => {

    Todo.create({
        todo_description: req.body.todo_description,
        todo_responsible: req.body.todo_responsible,
        todo_priority: req.body.todo_priority,
        todo_completed: req.body.todo_completed
    })
        .then()
        .catch();

    res.send('Data Recieved!');
});
//Routing point listening for update
app.put('/todos/update/:id', (req, res) => {

    console.log("Update " + req.params.id);

    Todo.findByIdAndUpdate(req.params.id,
        req.body,
        (err, data) => {
            res.status(201).send(data);
        })

});


//delete methos is in progress...............

app.delete('/api/todos/:id', (req, res) => {
    console.log(req.params.id);

    Todo.findByIdAndDelete({ id: req.params.id },
        (err, data) => {
            res.send(data);
        })
})

/

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../build/index.html'));

// });



app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});


