import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/common";
import {
  RESPONSE_CODE,
  RESPONSE_SUCCESS,
} from "../common/interfaces/Constants";
import { logger } from "../utils/logger";
import { uploadImageCloudinary } from "../utils/CloudnaryService";
import { Offer } from "../models/Offer";

export default class OfferController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { files } = req;

      if (Array.isArray(files) && files.length > 0) {
        const uploadedImages = await Promise.all(
          files.map((file) => uploadImageCloudinary(file, "Offers"))
        );

        req.body.image = uploadedImages;
      }

      const createdOffer = await Offer.create(req.body);
      return sendResponse(
        res,
        createdOffer,
        "Offer created successfully",
        RESPONSE_SUCCESS,
        RESPONSE_CODE.CREATED
      );
    } catch (error) {
      logger.error(`OfferController.create() -> Error: ${error}`);
      next(error);
    }
  }
}
