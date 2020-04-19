import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order, deliveryProblemExists } = data;

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
  }
}

export default new CancellationMail();
