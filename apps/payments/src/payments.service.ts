import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
@Injectable()
export class PaymentsService {
  private noficiationService: NotificationsServiceClient;

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-08-16',
    },
  );
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      payment_method: 'pm_card_visa',
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    if (!this.noficiationService) {
      this.noficiationService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME,
        );
    }

    this.noficiationService
      .notifyEmail({
        email,
        text: `Your payment of $${amount} has completed successfully`,
      })
      .subscribe(() => {});
    return paymentIntent;
  }
}
