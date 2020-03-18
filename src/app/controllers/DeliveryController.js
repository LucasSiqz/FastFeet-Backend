import { Op } from 'sequelize';
import {
  isAfter,
  isBefore,
  parseISO,
  setSeconds,
  setMinutes,
  setHours,
  startOfDay,
  endOfDay,
} from 'date-fns';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Orders';
import Recipient from '../models/Recipient';

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
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'recipient_name',
              'street',
              'number',
              'complement',
              'state',
              'city',
              'cep',
            ],
          },
        ],
      });

      return res.status(200).json(deliveries);
    }

    const deliveries = await Order.findAll({
      where: {
        end_date: {
          [Op.ne]: null,
        },
        deliveryman_id: req.params.id,
      },
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'path', 'name'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'recipient_name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'cep',
          ],
        },
      ],
    });

    return res.status(200).json(deliveries);
  }

  async update(req, res) {
    const checkDeliveryman = await Deliveryman.findByPk(
      req.params.deliveryman_id
    );

    if (!checkDeliveryman) {
      res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const checkOrder = await Order.findByPk(req.params.order_id);

    if (!checkOrder) {
      res.status(400).json({ error: 'Order does not exists' });
    }

    const orderBelongsDeliveryman = await Order.findOne({
      where: {
        id: req.params.order_id,
        deliveryman_id: req.params.deliveryman_id,
      },
    });

    if (!orderBelongsDeliveryman) {
      return res.status(400).json({
        error: 'This Order does not belogs to the deliverman',
      });
    }

    let startDate = '';

    if (!orderBelongsDeliveryman.start_date) {
      if (!req.body.start_date) {
        return res.status(400).json({
          error: 'Start date is needed',
        });
      }
      startDate = parseISO(req.body.start_date);
      const withdrawalsOnDay = await Order.findAll({
        where: {
          start_date: {
            [Op.between]: [startOfDay(startDate), endOfDay(startDate)],
          },
          deliveryman_id: req.params.deliveryman_id,
        },
      });

      if (Object.keys(withdrawalsOnDay).length === 5) {
        return res.status(401).json({
          error: 'you already made 5 withdrawals today!',
        });
      }
    } else if (req.body.start_date) {
      return res.status(400).json({
        error: 'the order has already been withdrawn',
      });
    } else {
      startDate = orderBelongsDeliveryman.start_date;
    }

    const endDate = parseISO(req.body.end_date);

    if (isBefore(endDate, startDate)) {
      return res
        .status(400)
        .json({ error: 'End date can not be before then start date' });
    }

    const startInterval = setSeconds(setMinutes(setHours(startDate, 8), 0), 0);
    const endInterval = setSeconds(setMinutes(setHours(startDate, 18), 0), 0);

    if (isAfter(startDate, endInterval) || isBefore(startDate, startInterval)) {
      return res.status(400).json({
        error: 'Orders must be picked up between 08:00h and 18:00h',
      });
    }

    const data = await orderBelongsDeliveryman.update(req.body, {
      attributes: [
        'id',
        'product',
        'recipient_id',
        'canceled_at',
        'start_date',
        'end_date',
        'signature_id',
      ],
    });

    return res.status(200).json(data);
  }
}

export default new DeliveryController();
