const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

const problemService = require('../services/problemService');

EXECUTOR_SERVER_URL = 'http://localhost:5000/executors';
// register a method in restClient called 'execute', and it's a POST request.
restClient.registerMethod('execute', EXECUTOR_SERVER_URL, 'POST');

//GET /api/v1/problems
router.get('/problems', function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// GET /api/v1/problems/:id
router.get('/problems/:id', function(req, res) {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

// POST /api/v1/problems
router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        },
        error => {
            res.status(400).send('Problem name already exists!');
        });
});

//POST /api/v1/executors
router.post('/executors', jsonParser, function(req, res){
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;
    console.log(lang + ': ' + userCodes);
    //res.json({'text': 'hahahaha'});
    restClient.methods.execute(
        {
            data: {code: userCodes, lang: lang},
            headers: {'Content-Type': 'application/json'}
        }, (data, response) => {
            console.log('Received from executor');
            //data structure is like: {build: 'haha', run: 'hehe'}
            const text = `Build output: ${data['build']}    Execute output: ${data['run']}`;
            data['text'] = text;
            res.json(data);
        }
    );
});

module.exports = router;