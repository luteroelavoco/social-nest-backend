import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  HttpException,
  Get,
} from '@nestjs/common';
import { TradeProposalsService } from './trade-proposals.service';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import { BooksService } from '@/books/books.service';
import mongoose from 'mongoose';

@Controller('trade-proposals')
export class TradeProposalsController {
  constructor(
    private readonly tradeProposalsService: TradeProposalsService,
    private readonly booksService: BooksService,
  ) {}

  @Post()
  async create(@Body() createTradeProposalDto: CreateTradeProposalDto) {
    const { offeredBook, desiredBook } = createTradeProposalDto;

    const fromUser = (await this.booksService.findById(offeredBook)).owner;

    const toUser = (await this.booksService.findById(desiredBook)).owner;

    const activeTradeProposal =
      await this.tradeProposalsService.getActiveTradeProposal({
        offeredBook,
        desiredBook,
        fromUser,
        toUser,
      });
    if (activeTradeProposal) {
      throw new HttpException('This trade proposal is already created.', 403);
    }

    const bookHasAlreadyBeenTraded =
      (await this.tradeProposalsService.hasBookBeenTraded(offeredBook)) ||
      (await this.tradeProposalsService.hasBookBeenTraded(desiredBook));

    if (bookHasAlreadyBeenTraded) {
      throw new HttpException('The book has already been traded.', 403);
    }

    return this.tradeProposalsService.create({
      offeredBook,
      desiredBook,
      fromUser,
      toUser,
    });
  }

  @Get('user/:userId')
  async getUserTradeProposals(
    @Param('userId') userId: mongoose.Types.ObjectId,
  ) {
    return this.tradeProposalsService.getUserTradeProposals(userId);
  }

  @Put(':proposalId/accept')
  async acceptTradeProposals(
    @Param('proposalId') proposalId: mongoose.Types.ObjectId,
  ) {
    const acceptedProposal =
      await this.tradeProposalsService.acceptTradeProposal(proposalId);
    if (!acceptedProposal) {
      throw new HttpException('Proposal not found or already accepted.', 404);
    }
    return acceptedProposal;
  }

  @Put(':proposalId/reject')
  async rejectTradeProposals(
    @Param('proposalId') proposalId: mongoose.Types.ObjectId,
  ) {
    const rejectedProposal =
      await this.tradeProposalsService.rejectTradeProposal(proposalId);
    if (!rejectedProposal) {
      throw new HttpException('Proposal not found or already rejected.', 404);
    }
    return rejectedProposal;
  }
}
