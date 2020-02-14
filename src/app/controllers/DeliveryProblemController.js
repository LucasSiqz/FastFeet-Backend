import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Orders';
import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const deliveriesWithProblems = await DeliveryProblems.findAll({
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [
            'id',
            'product',
            'start_date',
            'recipient_id',
            'deliveryman_id',
          ],
        },
      ],
    });

    if (!deliveriesWithProblems) {
      res.json({ message: 'there are no orders with problems' });
    }

    return res.json(deliveriesWithProblems);
  }

  async store(req, res) {
    const orderExists = await Order.findByPk(req.params.delivery_id);

    if (!orderExists) {
      return res.json({ error: 'Order does not exists' });
    }

    const deliveryProblem = await DeliveryProblems.create({
      delivery_id: req.params.delivery_id,
      description: req.body.description,
    });

    return res.json(deliveryProblem);
  }

  async show(req, res) {}

  async delete(req, res) {}
}

export default new DeliveryProblemController();
