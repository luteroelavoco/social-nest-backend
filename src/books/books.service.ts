import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './entities/book.entity';
import {
  TradeProposal,
  TradeProposalDocument,
} from '@/trade-proposals/entities/trade-proposal.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(TradeProposal.name)
    private tradeProposalModel: Model<TradeProposalDocument>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = new this.bookModel(createBookDto);
    return (await book.save()).populate('owner');
  }

  async findById(id: mongoose.Types.ObjectId): Promise<Book> {
    const book = await this.bookModel.findById(id);
    return book;
  }

  async search(search: string) {
    const books = await this.bookModel
      .find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .sort({ updatedAt: -1 })
      .populate('owner');

    return books;
  }

  async available(search: string) {
    const acceptedTradeProposals = await this.tradeProposalModel.find({
      status: 'accepted',
    });
    const acceptedOfferedBookIds = [];

    acceptedTradeProposals.map((proposal) => {
      acceptedOfferedBookIds.push(proposal.offeredBook);
      acceptedOfferedBookIds.push(proposal.offeredBook);
    });

    const availableBooks = await this.bookModel
      .find({
        _id: { $nin: acceptedOfferedBookIds },
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .sort({ updatedAt: -1 })
      .populate('owner');

    return availableBooks;
  }
}
