import { NextFunction, Request, Response } from 'express';
import Person from '../sequelize/models/person.model';

class PersonController {
  async getAllPersons(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    const data = await Person.findAll();
    res.send(data);
  }
}

export default new PersonController();
