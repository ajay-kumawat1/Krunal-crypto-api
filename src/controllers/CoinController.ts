import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
  RESPONSE_SUCCESS,
} from "../common/interfaces/Constants";
import { logger } from "../utils/logger";
import { CoinService } from "../services/CoinService";
import CoinFactory from "../factories/CoinFactory";

export default class CoinController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coinService = new CoinService();

      const isExists = await coinService.findOne({
        symbol: req.body.symbol,
        name: req.body.name,
      });
      if (isExists) {
        return sendResponse(
          res,
          {},
          "Coin already exists",
          RESPONSE_FAILURE,
          RESPONSE_CODE.BAD_REQUEST
        );
      }

      const generatedCoin = CoinFactory.generateCoin(req.body);
      const createdCoin = await coinService.create(generatedCoin);
      return sendResponse(
        res,
        createdCoin,
        "Coin created successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      logger.error(`CoinController.create() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coins = await CoinService.find({});
      if (!coins || coins.length === 0) {
        return sendResponse(
          res,
          {},
          "No coins found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        coins,
        "Coins retrieved successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`CoinController.getAll() -> Error: ${error}`);
      next(error);
    }
  }

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coinService = new CoinService();
      const { id } = req.params;

      const coin = await coinService.findOne({ _id: id });
      if (!coin) {
        return sendResponse(
          res,
          {},
          "Coin not found",
          RESPONSE_FAILURE,
          RESPONSE_CODE.NOT_FOUND
        );
      }

      return sendResponse(
        res,
        coin,
        "Coin retrieved successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.SUCCESS
      );
    } catch (error) {
      logger.error(`CoinController.getById() -> Error: ${error}`);
      next(error);
    }
  }
}
