import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

import validadeUserStore from './app/validators/UserStore';
import validadeSessionStore from './app/validators/SessionStore';
import validadeRecipientStore from './app/validators/RecipientStore';
import valdiadeDeliverymanStore from './app/validators/DeliverymanStore';

const routes = new Router();

routes.post('/users', validadeUserStore, UserController.store);
routes.post('/session', validadeSessionStore, SessionControler.store);

routes.use(authMiddleware);

routes.post('/recipients', validadeRecipientStore, RecipientController.store);
routes.post('/deliverymans', valdiadeDeliverymanStore,DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);

export default routes;
