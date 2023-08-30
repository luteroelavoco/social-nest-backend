import { BooksService } from '@/books/books.service';
import { TradeProposalsController } from './trade-proposals.controller';
import { TradeProposalsService } from './trade-proposals.service';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import mongoose from 'mongoose';
import { HttpException } from '@nestjs/common';

describe('TradeProposalsController', () => {
  let tradeProposalsController: TradeProposalsController;
  let tradeProposalsService: TradeProposalsService;
  let bookService: BooksService;

  const createdProposal = {
    fromUser: new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0'),
    toUser: new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0'),
    offeredBook: new mongoose.Types.ObjectId('64ed5ca2ad8c77293882972e'),
    desiredBook: new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3'),
    status: 'pending',
    _id: '64e98701d44efc6f455c4fb3',
    createdAt: '2023-08-30T07:33:32.296Z',
    updatedAt: '2023-08-30T07:33:32.296Z',
    __v: 0,
  };

  beforeEach(() => {
    bookService = new BooksService({} as any, {} as any);
    tradeProposalsService = new TradeProposalsService({
      findOne: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null), // Mock populate method
      }),
    } as any);
    tradeProposalsController = new TradeProposalsController(
      tradeProposalsService,
      bookService,
    );
  });

  it('trade proposal service should be defined', () => {
    expect(tradeProposalsService).toBeDefined();
  });

  it('should create a trade proposal', async () => {
    const createTradeProposalDto: CreateTradeProposalDto = {
      offeredBook: new mongoose.Types.ObjectId('64ed5ca2ad8c77293882972e'),
      desiredBook: new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3'),
    };

    tradeProposalsService.hasBookBeenTraded = jest
      .fn()
      .mockResolvedValue(false);

    jest
      .spyOn(bookService, 'findById')
      .mockImplementationOnce(
        () => ({ owner: createdProposal.fromUser }) as any,
      )
      .mockImplementationOnce(() => ({ owner: createdProposal.toUser }) as any);

    jest
      .spyOn(tradeProposalsService, 'create')
      .mockImplementation(() => createdProposal as any);

    expect(await tradeProposalsController.create(createTradeProposalDto)).toBe(
      createdProposal,
    );
  });

  it('should throw an error if the offered book is already in an active trade', async () => {
    const createTradeProposalDto: CreateTradeProposalDto = {
      offeredBook: new mongoose.Types.ObjectId('64ed5ca2ad8c77293882972e'),
      desiredBook: new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3'),
    };

    tradeProposalsService.hasBookBeenTraded = jest.fn().mockResolvedValue(true);

    jest
      .spyOn(bookService, 'findById')
      .mockImplementationOnce(
        () => ({ owner: createdProposal.fromUser }) as any,
      )
      .mockImplementationOnce(() => ({ owner: createdProposal.toUser }) as any);

    try {
      await tradeProposalsController.create(createTradeProposalDto);
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('The book has already been traded.');
      expect(error.getStatus()).toBe(403);
    }
  });

  it('should throw an error if the trade proposal is already created.', async () => {
    const createTradeProposalDto: CreateTradeProposalDto = {
      offeredBook: new mongoose.Types.ObjectId('64ed5ca2ad8c77293882972e'),
      desiredBook: new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3'),
    };

    tradeProposalsService.getActiveTradeProposal = jest
      .fn()
      .mockResolvedValue(true);

    jest
      .spyOn(bookService, 'findById')
      .mockImplementationOnce(
        () => ({ owner: createdProposal.fromUser }) as any,
      )
      .mockImplementationOnce(() => ({ owner: createdProposal.toUser }) as any);

    try {
      await tradeProposalsController.create(createTradeProposalDto);
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('This trade proposal is already created.');
      expect(error.getStatus()).toBe(403);
    }
  });
});
