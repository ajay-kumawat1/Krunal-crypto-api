import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/common";
import { RESPONSE_CODE, RESPONSE_FAILURE } from "../interfaces/Constants";
import { UserRole } from "../enum/Role";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config/config";
import { UserService } from "../../services/UserService";

export default class AuthAuthenticator {
  /**
   * Middleware function to check if the user is authenticated.
   */
  public static isAuthenticated() {
    return [AuthAuthenticator.validateJWT];
  }

  public static isAdminAuthenticated() {
    return [
      AuthAuthenticator.validateJWT,
      AuthAuthenticator.isAdminLoggedIn,
    ];
  }

  protected static async validateJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer")) {
      return sendResponse(res, {}, "You must login first", RESPONSE_FAILURE, RESPONSE_CODE.UNAUTHORIZED);
    }
    const token = authToken.split(" ")[1];

    try {
      const decode = jwt.verify(token, config.token.secret as string) as JwtPayload;
      const user = await UserService.findById(decode.user);
      if (user) {
        req.user = decode.user;
        return next();
      } else {
        return sendResponse(res, {}, "Invalid token", RESPONSE_FAILURE, RESPONSE_CODE.FORBIDDEN);
      }

    } catch (error) {
      return sendResponse(
        res,
        {},
        "Internal server error",
        RESPONSE_FAILURE,
        RESPONSE_CODE.INTERNAL_SERVER_ERROR
      );
    }
  }

  protected static async isAdminLoggedIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userDetails = req.user;
      if (
        typeof userDetails === "object" &&
        userDetails !== null &&
        (userDetails as any)?.role === UserRole.ADMIN
      ) {
        req.user = userDetails;
        next();
      } else {
        return sendResponse(
          res,
          {},
          "You are not authorized to perform this action",
          RESPONSE_FAILURE,
          RESPONSE_CODE.UNAUTHORIZED
        );
      }
    } catch (error) {
      console.error("Admin authentication error:", error);
      return sendResponse(
        res,
        {},
        "Internal server error",
        RESPONSE_FAILURE,
        RESPONSE_CODE.INTERNAL_SERVER_ERROR
      );
    }
  }
}
