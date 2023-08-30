import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TradeProposalDocument = TradeProposal & Document;

@Schema({ timestamps: true })
export class TradeProposal {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  fromUser: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  toUser: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  offeredBook: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Book', required: true })
  desiredBook: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: string;
}

export const TradeProposalSchema = SchemaFactory.createForClass(TradeProposal);
