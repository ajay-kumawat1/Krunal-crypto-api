import { model, Schema } from "mongoose";

export interface IOffer {
  image: string[];
}

export interface IOfferDoc extends IOffer, Document {}

// CRUD TYPES
export type UpdateOfferBody = Partial<IOffer>;
export type NewOfferDoc = Omit<IOffer, "created">;

const offerSchema = new Schema<IOfferDoc>(
  {
    image: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

export const Offer = model<IOfferDoc>("Offer", offerSchema, "offers");
