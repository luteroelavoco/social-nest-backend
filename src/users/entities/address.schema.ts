import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  street: string;

  @Prop()
  number: number;

  @Prop()
  complement: string;

  @Prop()
  cep: string;

  @Prop()
  neighborhood: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
