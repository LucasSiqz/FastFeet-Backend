import { Op } from 'sequelize';
import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

import NewOrderMail from '../jobs/NewOrderMail';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    if (req.query.product) {
      const product = `%${req.query.product}%`;
      const orders = await Order.findAll({
        where: {
          product: {
            [Op.like]: product,
          },
        },
        attributes: [
          'id',
          'recipient_id',
          'deliveryman_id',
          'signature_id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
        ],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'recipient_name',
              'cep',
              'city',
              'state',
              'street',
              'number',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'avatar_id'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['name', 'path', 'url'],
              },
            ],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
      return res.status(200).json(orders);
    }

    const orders = await Order.findAll({
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'recipient_name',
            'cep',
            'city',
            'state',
            'street',
            'number',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.status(200).json(orders);
  }

  async store(req, res) {
    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    await Queue.add(NewOrderMail.key, {
      deliveryman,
      recipient,
      productName: req.body.product,
    });

    return res.status(200).json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    await order.update(req.body);

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'recipient_name', 'cep'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async show(req, res) {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'recipient_name', 'cep'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    return res.status(200).json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    await order.destroy();

    return res.status(200).json({
      success: `Order with id ${req.params.id} was deleted`,
    });
  }
}

export default new OrderController();
