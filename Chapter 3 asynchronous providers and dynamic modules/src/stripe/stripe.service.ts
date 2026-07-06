import { Injectable, Inject } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './stripe.module-definition';
import type { StripeModuleOptions } from './stripe.module-definition';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripeClient: Stripe;

  // Inject the generated token to receive the { apiKey: string } object
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: StripeModuleOptions) {
    
    // Initialize the third-party library using the provided key
    this.stripeClient = new Stripe(this.options.apiKey, {
      apiVersion: '2026-06-24.dahlia',
    });
  }

  async processPayment(amount: number, customerId: string) {
    // Business logic using this.stripeClient goes here
    return true;
  }
}