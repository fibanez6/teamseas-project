import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { DonationCreateInput } from '../@generated/prisma-nestjs-graphql/donation/donation-create.input';
import { OrderByParams } from '../graphql';
import { DonationsService } from './donations.service';

const pubSub = new PubSub();
const TOTAL_UPDATED = 'totalUpdated';

@Resolver('Donation')
export class DonationsResolver {
  
  constructor(private readonly donationsService: DonationsService) { }

  @Mutation('createDonation')
  // DonationCreateInput from @generated contains validator annotations, Prisma one doesn't
  async create(@Args('createDonationInput') createDonationInput: DonationCreateInput) { //Prisma.DonationCreateInput

    const created = await this.donationsService.create(createDonationInput);
    const total = await this.donationsService.getTotal();

    pubSub.publish(TOTAL_UPDATED, { totalUpdated: { total } });
    return created;
  }

  @Subscription()
  totalUpdated() {
    return pubSub.asyncIterator(TOTAL_UPDATED);
  }

  @Query('donations')
  findAll(@Args('orderBy') orderBy?: OrderByParams) {
    return this.donationsService.findAll(orderBy);
  }

  @Query('donation')
  findOne(@Args('id') id: number) {
    return this.donationsService.findOne({ id });
  }

  @Query('totalDonations')
  totalDonations() {
    return this.donationsService.getTotal();
  }

}
