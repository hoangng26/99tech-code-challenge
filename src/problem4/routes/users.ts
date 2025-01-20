import express from 'express';
import Person from '../sequelize/models/person.model';

var usersRouter = express.Router();

/* GET users listing. */
usersRouter.get('/', async function (req, res, next) {
  const data = await Person.findAll();
  res.send(data);
});

usersRouter.get('/:id', async function (req, res, next) {
  const id = req.params.id;
  const data = await Person.findByPk(id);
  res.send(data);
});

usersRouter.get('/search', async function (req, res, next) {
  const { name } = req.query;
  if (!name) {
    res.status(400).send({ error: 'Name query parameter is required' });
  } else {
    try {
      const data = await Person.findAll({ where: { name } });
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
});

usersRouter.post('/create', function (req, res, next) {
  const data = req.body;

  Person.create(data).then((result) => {
    res.send(result);
  });
});

usersRouter.put('/update/:id', function (req, res, next) {
  const data = req.body;
  const id = req.params.id;

  Person.update(data, { where: { id } }).then((result) => {
    res.send(result);
  });
});

usersRouter.delete('/delete/:id', function (req, res, next) {
  const id = req.params.id;

  Person.destroy({ where: { id } }).then((result) => {
    res.send(result);
  });
});

export default usersRouter;
