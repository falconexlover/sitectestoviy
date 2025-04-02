import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  title: string;
  description: string;
  image: string;
  tag?: string;
  features: string[];
  price: string;
  priceNote?: string;
  additionalPrice?: string;
  additionalPriceNote?: string;
  capacity: number;
  hasPrivateBathroom: boolean;
  size: number;
  bedType: string;
  roomCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      trim: true
    },
    features: {
      type: [String],
      default: []
    },
    price: {
      type: String,
      required: true
    },
    priceNote: {
      type: String
    },
    additionalPrice: {
      type: String
    },
    additionalPriceNote: {
      type: String
    },
    capacity: {
      type: Number,
      required: true
    },
    hasPrivateBathroom: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      required: true
    },
    bedType: {
      type: String,
      required: true
    },
    roomCount: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRoom>('Room', RoomSchema); 