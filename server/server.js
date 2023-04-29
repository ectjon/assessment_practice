//express server
const path = require('path')
const express = require('express')
const { Pool } = require('pg')
const EventEmitter = require('events')
PG_URI = 'postgres://qidsekbg:gWIoDRAlCtfHfb0P46T4gnuBr1CFvReX@mahmud.db.elephantsql.com/qidsekbg'
const pool = new Pool({
  connectionString: PG_URI,
});

// exposees us to methods we can use on, emit, etc
const eventEmitter = new EventEmitter();

eventEmitter.on('start', () => {
  console.log('started');
})

const app = express();
const port = 3000;

// CREATE TABLE items (
//   id SERIAL PRIMARY KEY,
//   content TEXT
//   )


// INSERT INTO items (content)
// VALUES ('test item 1')

app.use(express.json());

function getDB(req, res, next) {
  pool.query('SELECT * FROM items')
    .then(result=>{
      res.locals.items = result.rows
      return next();
    })
    .catch(err => (next(err)))
}

function postDB(req, res, next) {
  const { text } = req.body;
  pool.query('INSERT INTO items (content) VALUES ($1);', [text])
    .then(result => {
      console.log('Inserted', text);
      return next();
    })
    .catch(err => (next(err)));
}

function deleteDB(req, res, next) {
  const { id } = req.body;
  pool.query('DELETE FROM items WHERE id =($1);', [id])
    .then(result => {
      console.log('Delete', id);
      return next();
    })
    .catch(err => (next(err)));
}

function updateDB(req, res, next){

  const { id, text } = req.body;
  pool.query('UPDATE items SET content=$2 WHERE id = $1;', [id, text])
  .then(result =>{
    console.log('check it out, we updated the text to: ', result)
    return next()
  })
  .catch(err => (next(err)));

}

// we need a events middleware to listen for any /db endpoints 
app.use('/events', (res, req) => {

})

// app.use('/db',  , (res, req) => {

// })
//get the list
app.get('/db', getDB, (req, res) => {
  res.status(200).json(res.locals.items);
})
//add an item to the list
app.post('/db', postDB, (req, res) => {
  res.sendStatus(201);
})
//delete an item from the list
app.delete('/db', deleteDB, (req, res) => {
  res.sendStatus(200);
})
//update an item on the list
app.put('/db', updateDB, (req, res) =>{
  res.sendStatus(200);
})


//get the page 
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'))
})

app.get('/script.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../script.js'))
})
//listen for calls to the port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

