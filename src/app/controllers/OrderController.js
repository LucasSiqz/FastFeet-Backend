import Order from '../models/Orders';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderController {
  async index(req, res) {
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
    return res.json(orders);
  }

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

  async update(req, res) {
    // const deliveryman = await Deliveryman.findByPk(req.params.id);
    // if (!deliveryman) {
    //   return res.status(400).json({ error: 'Deliveryman id does not exists' });
    // }
    // const { email } = req.body;
    // if (email !== deliveryman.email) {
    //   const deliverymanExists = await Deliveryman.findOne({ where: { email } });
    //   if (deliverymanExists) {
    //     return res.status(400).json({ error: 'Deliverman already exists.' });
    //   }
    // }
    // await deliveryman.update(req.body);
    // const { id, name, avatar } = await Deliveryman.findByPk(req.params.id, {
    //   include: [
    //     {
    //       model: File,
    //       as: 'avatar',
    //       attributes: ['id', 'path', 'url'],
    //     },
    //   ],
    // });
    // return res.json({
    //   id,
    //   name,
    //   email,
    //   avatar,
    // });
  }
}

export default new OrderController();
