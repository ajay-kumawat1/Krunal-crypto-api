import { FilterQuery, ProjectionType, SortOrder } from "mongoose";
import { Coin, ICoinDoc } from "../models/Coin";

export class CoinService {
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

}
