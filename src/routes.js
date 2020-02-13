import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

import validadeUserStore from './app/validators/UserStore';
import validadeSessionStore from './app/validators/SessionStore';
import validadeRecipientStore from './app/validators/RecipientStore';
import valdiadeDeliverymanStore from './app/validators/DeliverymanStore';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validadeUserStore, UserController.store);
routes.post('/session', validadeSessionStore, SessionControler.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:order_id',
  DeliveryController.update
);

routes.use(authMiddleware);

routes.post('/recipients', validadeRecipientStore, RecipientController.store);

routes.post(
  '/deliverymans',
  valdiadeDeliverymanStore,
  DeliverymanController.store
);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

export default routes;
