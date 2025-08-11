import { Request } from 'express';
import { AnySchema, ValidationError } from 'joi';
interface IValidateResponse {
    error?: ValidationError | undefined;
    warning?: ValidationError | undefined;
    value: unknown;
}

export class ValidationMiddleware {
    public constructor() {}

    public static validateRequest(req: Request, schema: AnySchema): IValidateResponse {
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true, // remove unknown props
        };
        return schema.validate(req.body, options);
    }
}
