import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeProposalsService } from './trade-proposals.service';
import { TradeProposalsController } from './trade-proposals.controller';
import {
  TradeProposal,
  TradeProposalSchema,
} from './entities/trade-proposal.entity';
import { BooksService } from '@/books/books.service';
import { Book, BookSchema } from '@/books/entities/book.entity';
import { User, UserSchema } from '@/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeProposal.name, schema: TradeProposalSchema },
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TradeProposalsController],
  providers: [TradeProposalsService, BooksService],
})
export class TradeProposalsModule {}
