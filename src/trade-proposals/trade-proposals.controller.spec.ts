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

    tradeProposalsService.hasBookBeenTraded = jest
      .fn()
      .mockResolvedValue(createdProposal);

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
      .mockResolvedValue(createdProposal);

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

  it('should get user trade proposals', async () => {
    const userId = new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0');
    const userTradeProposals = [createdProposal];
    jest
      .spyOn(tradeProposalsService, 'getUserTradeProposals')
      .mockImplementation(() => userTradeProposals as any);

    const result = await tradeProposalsController.getUserTradeProposals(userId);
    expect(tradeProposalsService.getUserTradeProposals).toHaveBeenCalledWith(
      expect.objectContaining(userId),
    );
    expect(result).toBe(userTradeProposals);
  });

  it('should get empty user trade proposals', async () => {
    const userId = new mongoose.Types.ObjectId('64b95781dc3fb7f79e6bb5b0');
    const userTradeProposals = [];
    jest
      .spyOn(tradeProposalsService, 'getUserTradeProposals')
      .mockImplementation(() => userTradeProposals as any);

    const result = await tradeProposalsController.getUserTradeProposals(userId);
    expect(tradeProposalsService.getUserTradeProposals).toHaveBeenCalledWith(
      expect.objectContaining(userId),
    );
    expect(result).toStrictEqual([]);
  });

  it('should accept user trade proposal', async () => {
    const proposalId = new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3');
    jest
      .spyOn(tradeProposalsService, 'acceptTradeProposal')
      .mockImplementation(() => acceptedTradeProposal as any);
    const acceptedTradeProposal = { ...createdProposal, status: 'accepted' };

    const result =
      await tradeProposalsController.acceptTradeProposals(proposalId);

    expect(tradeProposalsService.acceptTradeProposal).toHaveBeenCalledWith(
      expect.objectContaining(proposalId),
    );
    expect(result).toEqual(acceptedTradeProposal);
    expect(result).toMatchObject({ status: 'accepted' });
  });

  it('should throw an error if the proposal is not found or already accepted', async () => {
    const proposalId = new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3');

    tradeProposalsService.acceptTradeProposal = jest
      .fn()
      .mockResolvedValue(null);

    try {
      await tradeProposalsController.acceptTradeProposals(proposalId);
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Proposal not found or already accepted.');
      expect(error.getStatus()).toBe(404);
    }
  });

  it('should reject a trade proposal', async () => {
    const proposalId = new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3');
    const rejectedProposal = { ...createdProposal, status: 'rejected' };

    jest
      .spyOn(tradeProposalsService, 'rejectTradeProposal')
      .mockImplementation(() => rejectedProposal as any);

    const result =
      await tradeProposalsController.rejectTradeProposals(proposalId);
    expect(tradeProposalsService.rejectTradeProposal).toHaveBeenCalledWith(
      expect.objectContaining(proposalId),
    );
    expect(result).toBe(rejectedProposal);
  });

  it('should throw an error if proposal is not found or already rejected', async () => {
    const proposalId = new mongoose.Types.ObjectId('64e98701d44efc6f455c4fb3');

    tradeProposalsService.rejectTradeProposal = jest
      .fn()
      .mockResolvedValue(null);

    try {
      await tradeProposalsController.rejectTradeProposals(proposalId);
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Proposal not found or already rejected.');
      expect(error.getStatus()).toBe(404);
    }
  });
});
