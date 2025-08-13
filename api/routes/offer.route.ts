import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import { handleCoinMultipartData } from "../utils/fileHandler";
import OfferController from "../controllers/OfferController";

export class OfferRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "offer", "OfferRoute");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}`)
      .post(handleCoinMultipartData.array("image", 10), OfferController.create);

    return this.app;
  }
}
