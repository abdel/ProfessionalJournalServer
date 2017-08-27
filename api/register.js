var _ = require('lodash');
var wrap = require('co-express');

var api = {
    // an example of executing a stored procedure
    post: wrap(function *(req, res, next) {
        var checkUsername = yield req.azureMobile.data.execute({
            sql: 'SELECT username FROM Author WHERE username = @username',
            parameters: [
                { name: 'username', value: req.body.Username }
            ]
        });
        
        if (!_.isEmpty(checkUsername)) {
            res.status(500).send({ error: "Username already exists." });
        }
        
        var insertQuery = {
            sql: 'INSERT INTO Author (username, password) VALUES (@username, @password)',
            parameters: [
                { name: 'username', value: req.body.Username },
                { name: 'password', value: req.body.Password }
            ]
        };
       
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
