import { Router } from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import {celebrate} from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';
import Joi from '@hapi/joi';

const upload = multer(multerConfig);

const routes = Router();

const pointsController = new PointsController();
const itemsControler = new ItemsController();

routes.get('/items', itemsControler.index);

routes.get('/point', pointsController.index);
routes.get('/point/:id', pointsController.show);
routes.post('/point', 
  upload.single('image'), 
  celebrate({
    body:Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email,
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required()
    })
  }, {abortEarly: false}),
  pointsController.create);

export default routes;