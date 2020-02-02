import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionControler from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import validadeUserStore from './app/validators/UserStore';
import validadeSessionStore from './app/validators/SessionStore';

const routes = new Router();

routes.post('/users', validadeUserStore, UserController.store);
routes.post('/session', validadeSessionStore, SessionControler.store);

routes.use(authMiddleware);

export default routes;
