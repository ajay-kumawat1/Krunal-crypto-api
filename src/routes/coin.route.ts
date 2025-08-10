import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import CoinController from "../controllers/CoinController";

export class CoinRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "coin", "CoinRoute");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}/getAll`)
      .get(CoinController.getAll);

    return this.app;
  }
}
