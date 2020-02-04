import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes:['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes:['name', 'path', 'url'],
        }
      ],
    });
    return res.json(deliverymans);
  }

  async store(req, res) {
    const deliverymanExists = await Deliveryman.findOne({ where: { email: req.body.email}});

    if(deliverymanExists){
      return res.status(400).json({ error: 'Deliveryman already exists. '});
    }

    const { id, name, email, avatar } = await Deliveryman.create(req.body, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new DeliverymanController();