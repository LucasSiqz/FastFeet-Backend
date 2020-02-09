import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderController {
  async index(req, res) {}

  async store(req, res) {
    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body,
      {
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id'],
          },
        ],
      }
    );

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {}
}

export default new OrderController();
