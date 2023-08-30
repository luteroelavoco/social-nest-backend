import mongoose from 'mongoose';

export class CreateBookDto {
  title: string;
  author: string;
  description?: string;
  avatar?: string;
  owner: mongoose.Types.ObjectId;
}
