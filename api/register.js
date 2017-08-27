var _ = require('lodash');
var wrap = require('co-express');

var api = {
    /**
     * Registers a new author by checking for existing username before
     * inserting the author into the database.
     */
    post: wrap(function *(req, res, next) {
        // Find matching username in the database
        var checkUsername = yield req.azureMobile.data.execute({
            sql: 'SELECT username FROM Author WHERE username = @username',
            parameters: [
                { name: 'username', value: req.body.Username }
            ]
        });

        // Cancel registration if username is not unique
        if (!_.isEmpty(checkUsername)) {
            res.status(500).send({ error: "Username already exists." });
            return;
        }

        // Insert new author
        var insertQuery = {
            sql: 'INSERT INTO Author (username, password) VALUES (@username, @password)',
            parameters: [
                { name: 'username', value: req.body.Username },
                { name: 'password', value: req.body.Password }
            ]
        };

        // Execute insert query and return result
        req.azureMobile.data.execute(insertQuery)
            .then(function (result) {
                res.status(200).send({ msg: "Successfully registered author." });
            })
            .catch(function (error) {
               res.status(500).send({ error: "Failed to register author." }); 
            });
    })
};

module.exports = api;
