const express = require('express');
const router = express.Router();
const data = require('../data');

router.route('/people/:id')
    .get(async (req, res) => {
        try {
            const person = await data.getPersonById(req.params.id);
            res.json(person);
        } catch (e) {
            res.status(404).json(e);
        }
    });

router.route('/people')
    .get(async (req, res) => {
        try {
            const people = await data.get_people();
            res.json(people);
        } catch (e) {
            res.status(500).send(e);
        }
    });

router.route('/work/:id')
  .get(async (req, res) => {
      try {
          const person = await data.getWorkById(req.params.id);
          res.json(person);
      } catch (e) {
          res.status(404).json(e);
      }
  });

router.route('/work')
  .get(async (req, res) => {
      try {
          const people = await data.get_work();
          res.json(people);
      } catch (e) {
          res.status(500).send(e);
      }
  });

module.exports = router;
