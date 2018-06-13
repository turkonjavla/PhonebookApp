const express    = require('express'),
      router     = express.Router();

/*==========================
          models
==========================*/
const Phonebook = require('../models/Phonebook');

/*==========================
          routes
==========================*/

// index - shows all contacts
router.get('/', (req, res) => {
  let id = req.params.id;

  if(req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Phonebook
    .find({lastName: regex})
    .sort({firstName: 'desc'})
    .then(contacts => {
      res.render('contacts/index', {contacts: contacts});
    })
    .catch(err => console.log(`there was am error. Error details: ${err}`));
  }
  else {
    Phonebook
    .find(id)
    .sort({firstName: 'desc', lastName: 'desc'})
    .then(contacts => {
      res.render('contacts/index', {contacts: contacts});
    })
    .catch(err => console.log(`there was am error. Error details: ${err}`));
  }
});

// new - shows form for adding new contact
router.get('/new', (req, res) => {
  res.render('contacts/new');
});

// create - makes a POST request and adds contact to DB
router.post('/', (req, res) => {
  let errors = [];

  const firstName = req.body.firstName,
        lastName  = req.body.lastName,
        phone     = req.body.phoneNumber;

  if(!(firstName && lastName && phone)) {
    errors.push('error_msg', 'All fields are required');
  }

  // check if there are any errors
  if(errors.length > 0) {
    console.log(errors);
    req.flash('error_msg', 'All fields are required');
    res.redirect('/new');
  }
  else {
    // create new contact if no errors are found
    const contact = new Phonebook({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phone
    });

    contact
      .save()
      .then(() => {
        req.flash('success_msg', `${firstName} ${lastName} has been added to your contacts`);
        res.redirect('/');
      })
      .catch(err => console.log(`There was an error: ${err}`));
  }
});

// delete
router.delete('/:id', (req, res) => {
  let id = req.params.id;

  Phonebook
    .findByIdAndRemove(id)
    .then(contact => {
      req.flash('success_msg', `${contact.firstName} ${contact.lastName} has been removed from your contacts`);
      res.redirect('/');
    });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;