import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTradeProposalDto } from './dto/create-trade-proposal.dto';
import {
  TradeProposal,
  TradeProposalDocument,
} from './entities/trade-proposal.entity';
import mongoose, { Model } from 'mongoose';
import { ActiveTradeProposalDto } from './dto/active-trade-proposal.dto';

@Injectable()
export class TradeProposalsService {
  constructor(
    @InjectModel(TradeProposal.name)
    private tradeProposalModel: Model<TradeProposalDocument>,
  ) {}

  async create(createTradeProposalDto: CreateTradeProposalDto) {
    const newProposal = await this.tradeProposalModel.create(
      createTradeProposalDto,
    );
    return newProposal;
  }

  async acceptTradeProposal(proposalId: mongoose.Types.ObjectId) {
    const acceptedProposal = await this.tradeProposalModel
      .findByIdAndUpdate(proposalId, { status: 'accepted' }, { new: true })
      .populate('desiredBook fromUser toUser offeredBook');
    return acceptedProposal ? acceptedProposal : null;
  }

  async rejectTradeProposal(proposalId: mongoose.Types.ObjectId) {
    const rejectedProposal = await this.tradeProposalModel
      .findByIdAndUpdate(proposalId, { status: 'rejected' }, { new: true })
      .populate('desiredBook fromUser toUser offeredBook');
    return rejectedProposal ? rejectedProposal : null;
  }

  async getActiveTradeProposal(activeTradeProposalDto: ActiveTradeProposalDto) {
    const { fromUser, toUser, offeredBook, desiredBook } =
      activeTradeProposalDto;

    const activeProposal = await this.tradeProposalModel
      .findOne({
        fromUser,
        toUser,
        offeredBook,
        desiredBook,
      })
      .populate('desiredBook fromUser toUser offeredBook');

    return activeProposal ? activeProposal : null;
  }

  async getUserTradeProposals(userId: mongoose.Types.ObjectId) {
    const userTradeProposals = await this.tradeProposalModel
      .find({
        $or: [{ fromUser: userId }, { toUser: userId }],
      })
      .sort({ updatedAt: -1 })
      .populate('desiredBook fromUser toUser offeredBook');

    return userTradeProposals;
  }

  async hasBookBeenTraded(bookId: mongoose.Types.ObjectId): Promise<boolean> {
    const tradedProposal = await this.tradeProposalModel.findOne({
      $or: [{ offeredBook: bookId }, { desiredBook: bookId }],
      status: 'accepted',
    });

    return tradedProposal !== null;
  }
}
