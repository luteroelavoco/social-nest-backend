import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book, BookSchema } from './entities/book.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TradeProposal,
  TradeProposalSchema,
} from '@/trade-proposals/entities/trade-proposal.entity';
import { User, UserSchema } from '@/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: TradeProposal.name, schema: TradeProposalSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
