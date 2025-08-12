import { model, Schema } from "mongoose";

export interface ICoin {
  name: string;
  price: string;
  symbol: string;
  image?: string;
}

export interface ICoinDoc extends ICoin, Document {}

// CRUD TYPES
export type UpdateCoinBody = Partial<ICoin>;
export type NewCoinDoc = Omit<ICoin, "created">;

const coinSchema = new Schema<ICoinDoc>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    symbol: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Coin = model<ICoinDoc>("Coin", coinSchema, "coins");
