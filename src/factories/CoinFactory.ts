import Joi, { ObjectSchema } from "joi";
import BaseFactory from "./BaseFactory";
import { ILooseObject } from "../common/interfaces/ILooseObject";
import { Coin, ICoinDoc } from "../models/Coin";
import InvalidBuildDataError from "../common/error/InvalidBuildDataError";

export default class CoinFactory extends BaseFactory {
  public static generateCoin(data: ILooseObject): ICoinDoc {
    if (this.checkValidBuildData(data)) {
      return new Coin(data);
    } else {
      throw new InvalidBuildDataError("Coin");
    }
  }

  public static checkValidBuildData(data: ILooseObject): boolean {
    return !!data && data.name;
  }

  public static createCoinSchema(isUpdate = false): ObjectSchema<ICoinDoc> {
    const schema = Joi.object({
      name: isUpdate ? Joi.string() : Joi.string().required(),
      symbol: Joi.string().required(),
      price: isUpdate ? Joi.number() : Joi.number().required(),
      image: Joi.string().uri(),
    });
    return schema;
  }
}
