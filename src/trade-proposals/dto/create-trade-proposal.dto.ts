import mongoose from 'mongoose';

export class CreateTradeProposalDto {
  offeredBook: mongoose.Types.ObjectId;
  desiredBook: mongoose.Types.ObjectId;
  fromUser?: mongoose.Types.ObjectId;
  toUser?: mongoose.Types.ObjectId;
}
