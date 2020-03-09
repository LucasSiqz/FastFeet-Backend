import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddleware from './app/middlewares/auth';

import validadeUserStore from './app/validators/UserStore';
import validadeSessionStore from './app/validators/SessionStore';
import validadeRecipientStore from './app/validators/RecipientStore';
import validadeDeliverymanStore from './app/validators/DeliverymanStore';
import validadeOrderStore from './app/validators/OrderStore';
import validadeDeliveryProblemStore from './app/validators/DeliveryProblemStore';

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

routes.post(
  '/delivery/:order_id/problems',
  validadeDeliveryProblemStore,
  DeliveryProblemController.store
);
routes.get('/delivery/:order_id/problems', DeliveryProblemController.show);
routes.get('/deliveries/with-problems', DeliveryProblemController.index);

routes.use(authMiddleware);

routes.post('/recipients', validadeRecipientStore, RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);

routes.post(
  '/deliverymans',
  validadeDeliverymanStore,
  DeliverymanController.store
);
routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/orders', validadeOrderStore, OrderController.store);
routes.get('/orders', OrderController.index);
routes.get('/orders/:id', OrderController.show);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.delete(
  '/problem/:problem_id/cancel-delivery',
  DeliveryProblemController.delete
);

export default routes;
