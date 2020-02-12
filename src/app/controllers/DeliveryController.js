import { Op } from 'sequelize';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Orders';

class DeliveryController {
  async index(req, res) {
    const checkDeliveryman = await Deliveryman.findByPk(req.params.id);

    if (!checkDeliveryman) {
      res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    if (!req.query.old) {
      const deliveries = await Order.findAll({
        where: {
          end_date: null,
          canceled_at: null,
          deliveryman_id: req.params.id,
        },
      });

      return res.json(deliveries);
    }

    const deliveries = await Order.findAll({
      where: {
        end_date: {
          [Op.ne]: null,
        },
        canceled_at: null,
        deliveryman_id: req.params.id,
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {}

  async delete(req, res) {}
}

export default new DeliveryController();
