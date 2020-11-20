const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydb', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const kittySchema = new mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function () {
  const greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
  console.log(greeting);
}

Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})

const Kitten = mongoose.model('Kitten', kittySchema);
const silence = new Kitten({ name: 'Silence' });

console.log(silence.name);

const fluffy = new Kitten({ name: 'fluffy' });

 /* Functions added to the methods property of a 
 schema get compiled into the Model prototype and 
 exposed on each document instance: */ 
fluffy.speak(); // "Meow name is fluffy"

/* We have talking kittens! 
But we still haven't saved anything to MongoDB. 
Each document can be saved to the database by calling its save method. 
The first argument to the callback will be an error if any occurred. */
fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
});

/* This performs a search for all documents 
with a name property that begins with "fluff" and 
returns the result as an array of kittens to the callback. */
Kitten.find({ name: /^fluff/ }, callback);