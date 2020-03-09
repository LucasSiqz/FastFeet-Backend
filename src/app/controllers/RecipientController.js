import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const {
      id,
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    } = await Recipient.create(req.body);

    return res.status(200).json({
      id,
      recipient_name,
      street,
      number,
      complement,
      state,
      city,
      cep,
    });
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient id does not exists' });
    }

    return res.status(200).json(recipient);
  }

  async index(req, res) {
    if (req.query.recipient) {
      const name = `%${req.query.recipient}%`;
      const recipients = await Recipient.findAll({
        where: {
          recipient_name: {
            [Op.like]: name,
          },
        },
        attributes: [
          'id',
          'recipient_name',
          'street',
          'number',
          'state',
          'city',
          'cep',
        ],
      });
      return res.status(200).json(recipients);
    }

    const recipients = await Recipient.findAll({
      attributes: [
        'id',
        'recipient_name',
        'street',
        'number',
        'state',
        'city',
        'cep',
      ],
    });
    return res.status(200).json(recipients);
  }
}
export default new RecipientController();
