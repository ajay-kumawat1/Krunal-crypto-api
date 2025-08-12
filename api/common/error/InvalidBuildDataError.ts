import BaseError from "./BaseError";

export default class InvalidBuildDataError extends BaseError {
  public constructor(objectName: string) {
    super(`Invalid build data for ${objectName} generation`);
  }
}
