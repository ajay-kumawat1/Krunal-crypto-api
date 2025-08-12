import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import CoinController from "../controllers/CoinController";
import { handleCoinMultipartData } from "../utils/fileHandler";

export class OfferRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "offer", "OfferRoute");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}`)
      .post(handleCoinMultipartData.array("image", 10), CoinController.create);

    return this.app;
  }
}
