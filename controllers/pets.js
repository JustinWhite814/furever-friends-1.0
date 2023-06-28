/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/pets`
---------------------------------------------------------------------------------------
*/


/* Require modules
--------------------------------------------------------------- */
const express = require('express')
// Router allows us to handle routing outisde of server.js
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')


/* Routes
--------------------------------------------------------------- */
// Index Route (GET/Read): Will display all pets
router.get('/', function (req, res) {
    db.Pet.find({})
        .then(pets => {
            res.render('pets/pet-index', {
                pets: pets
            })
        })
})

// New Route (GET/Read): This route renders a form 
// which the user will fill out to POST (create) a new location
router.get('/new', (req, res) => {
    res.render('pets/new-form')
})

// Show Route (GET/Read): Will display an individual pet document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Pet.findById(req.params.id)
        .then(pet => {
            if (pet) {
                res.render('pets/pet-details', { pet: pet })
            } else {
                res.render('404')
            }
        })
        .catch(() => res.render('404'))
})

// Create Route (POST/Create): This route receives the POST request sent from the new route,
// creates a new pet document using the form data, 
// and redirects the user to the new pet's show page
router.post('/', (req, res) => {
    db.Pet.create(req.body)
        .then(pet => res.redirect('/pets/' + pet._id))
})


// Edit Route (GET/Read): This route renders a form
// the user will use to PUT (edit) properties of an existing pet
router.get('/:id/edit', (req, res) => {
    db.Pet.findById(req.params.id)
        .then(pet => res.render('pets/edit-form', { pet: pet }))
})

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route, 
// edits the specified pet document using the form data,
// and redirects the user back to the show page for the updated location.
router.put('/:id', (req, res) => {
    db.Pet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .then(pet => res.redirect('/pets/' + pet._id))
})

// Destroy Route (DELETE/Delete): This route deletes a pet document 
// using the URL parameter (which will always be the pet document's ID)
router.delete('/:id', (req, res) => {
    db.Pet.findByIdAndRemove(req.params.id)
        .then(() => res.redirect('/pets'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router