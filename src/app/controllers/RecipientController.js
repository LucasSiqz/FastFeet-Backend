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
