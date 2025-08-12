import { Application } from "express";
import { RoutesConfig } from "../common/interfaces/RoutesConfig";
import CoinController from "../controllers/CoinController";
import coinMiddleware from "../middlewares/coin.middleware";

export class CoinRoute extends RoutesConfig {
  public constructor(app: Application) {
    super(app, "coin", "CoinRoute");
  }

  public configureRoutes(): Application {
    this.app
      .route(`${this.path}`)
      .post(coinMiddleware.validateCoin, CoinController.create);

    this.app.route(`${this.path}/getAll`).get(CoinController.getAll);

    this.app
      .route(`${this.path}/:id`)
      .get(CoinController.getById)
      .put(CoinController.update)
      .delete(CoinController.delete);

    return this.app;
  }
}
