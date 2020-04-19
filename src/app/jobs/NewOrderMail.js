import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, productName } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda disponível!',
      template: 'newOrder',
      context: {
        deliveryman: deliveryman.name,
        product: productName,
        recipient_name: recipient.recipient_name,
        street: recipient.street,
        number: recipient.number,
        complement: recipient.complement,
        state: recipient.state,
        city: recipient.city,
        cep: recipient.cep,
      },
    });
  }
}

export default new NewOrderMail();
