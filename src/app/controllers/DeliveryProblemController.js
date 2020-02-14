import DeliveryProblem from '../models/DeliveryProblems';
import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const deliveriesWithProblems = await DeliveryProblem.findAll({
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
      res.status(400).json({ message: 'there are no orders with problems' });
    }

    return res.status(200).json(deliveriesWithProblems);
  }

  async store(req, res) {
    const orderExists = await Order.findByPk(req.params.order_id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: req.params.order_id,
      description: req.body.description,
    });

    return res.status(200).json(deliveryProblem);
  }

  async show(req, res) {
    const orderExists = await Order.findByPk(req.params.order_id);

    if (!orderExists) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const orderProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.order_id,
      },
    });

    if (Object.keys(orderProblems).length === 0) {
      return res.status(400).json({ error: 'This order has no problems' });
    }

    return res.status(200).json(orderProblems);
  }

  async delete(req, res) {
    const deliveryProblemExists = await DeliveryProblem.findByPk(
      req.params.problem_id
    );

    if (!deliveryProblemExists) {
      return res.status(400).json({ error: 'Problem does not exists' });
    }

    const order = await Order.findByPk(deliveryProblemExists.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (order.end_date !== null && order.signature_id !== null) {
      return res
        .status(400)
        .json({ error: 'This order has already been delivered' });
    }

    if (order.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'This order has already been canceled' });
    }

    await order.update({
      canceled_at: new Date(),
    });

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Encomenda Cancelada!',
      template: 'cancelOrder',
      context: {
        deliveryman: order.deliveryman.name,
        product: order.product,
        description: deliveryProblemExists.description,
      },
    });

    return res.status(200).json({ message: 'Delivery was canceled!' });
  }
}

export default new DeliveryProblemController();
