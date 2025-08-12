import {
  FilterQuery,
  ObjectId,
  ProjectionType,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from "mongoose";
import { Coin, ICoinDoc, NewCoinDoc } from "../models/Coin";

export class CoinService {
  /**
   * Creates a new coin.
   *
   * @param resource - The coin object to be created.
   * @returns A promise that resolves to the created coin document.
   */
  public async create(resource: NewCoinDoc): Promise<ICoinDoc> {
    return Coin.create(resource);
  }

  /**
   * Finds coin documents based on the provided query and options.
   *
   * @param query - The query object to filter the coin documents.
   * @param projection - The options object to specify the projection of the coin documents.
   * @param populate - The options object to specify the population of the coin documents.
   * @param sortOptions - The options object to specify the sorting of the coin documents.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of coin documents to return per page.
   * @returns A promise that resolves to an array of coin documents.
   */
  public static async find(
    query: FilterQuery<ICoinDoc>,
    projection?: ProjectionType<ICoinDoc>,
    populate?: { path: string; select?: string[] },
    sortOptions: { [key: string]: SortOrder } = {},
    page?: number,
    limit?: number
  ): Promise<ICoinDoc[]> {
    const cursor = Coin.find(query, projection);
    if (populate) {
      cursor.populate(populate);
    }
    if (sortOptions) {
      cursor.sort(sortOptions);
    }
    if (page !== undefined && limit) {
      cursor.skip(Math.max(page - 1, 0) * limit).limit(limit);
    }
    return cursor;
  }

  /**
   * Find one coin document based on the provided query.
   *
   * @param query - The query object to filter the coin documents.
   * @param projection - The options object to specify the projection of the coin documents.
   * @returns A promise that resolves to the found coin document.
   */
  public async findOne(
    query: FilterQuery<ICoinDoc>,
    projection?: ProjectionType<ICoinDoc>
  ): Promise<ICoinDoc | null> {
    return Coin.findOne(query, projection);
  }

  /**
   * Updates a coin document by its ID.
   *
   * @param id - The ID of the coin document to update.
   * @param updateDoc - The update object to apply to the coin document.
   * @param options - The options object to specify additional update options.
   * @returns A promise that resolves to the updated coin document.
   */
  public async updateById(
    id: string | ObjectId,
    updateDoc: UpdateQuery<ICoinDoc>,
    options?: QueryOptions<ICoinDoc>
  ): Promise<ICoinDoc | null> {
    return Coin.findByIdAndUpdate(id, updateDoc, options);
  }

  /**
   * Deletes a coin document by its ID.
   *
   * @param id - The ID of the coin document to delete.
   * @returns A promise that resolves to the deleted coin document.
   */
  public async deleteById(id: string | ObjectId): Promise<ICoinDoc | null> {
    return Coin.findByIdAndDelete(id);
  }
}
