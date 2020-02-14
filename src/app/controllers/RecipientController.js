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
}
export default new RecipientController();
