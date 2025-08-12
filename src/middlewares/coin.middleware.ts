import { NextFunction, Request, Response } from "express";
import {
  RESPONSE_CODE,
  RESPONSE_FAILURE,
} from "../common/interfaces/Constants";
import { sendResponse } from "../utils/common";
import CoinFactory from "../factories/CoinFactory";
import { ValidationMiddleware } from "../common/middleware/validation.middleware";
import { isEmpty, isObjectId } from "../utils/util";

class CoinMiddleware {
  public async validateCoin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (isEmpty(req.body)) {
      return sendResponse(
        res,
        {},
        "Coin data is not valid",
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }
    const coinSchema = CoinFactory.createCoinSchema();
    const { error, value } = ValidationMiddleware.validateRequest(
      req,
      coinSchema
    );
    if (error) {
      return sendResponse(
        res,
        {},
        `Coin data is not valid: ${error.details
          .map((x: { message: string }) => x.message.replace(/"/g, ""))
          .join(", ")}`,
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }
    req.body = value;
    next();
  }

  public async validateUpdateCoin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!isObjectId(req.params.id)) {
      return sendResponse(
        res,
        {},
        "Coin data is not valid",
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }
    if (isEmpty(req.body)) {
      return sendResponse(
        res,
        {},
        "Coin data is not valid",
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }

    const coinSchema = CoinFactory.createCoinSchema(true);
    const { error } = ValidationMiddleware.validateRequest(req, coinSchema);
    if (error) {
      return sendResponse(
        res,
        {},
        `Coin data is not valid: ${error.details
          .map((x) => x.message.replace(/"/g, ""))
          .join(", ")}`,
        RESPONSE_FAILURE,
        RESPONSE_CODE.BAD_REQUEST
      );
    }
    next();
  }
}
export default new CoinMiddleware();
