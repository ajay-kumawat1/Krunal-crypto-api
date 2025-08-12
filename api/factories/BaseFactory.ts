import mongoose, { Document } from 'mongoose';

export interface IBaseFactory {
    generate<T extends Document>(doc: Partial<T>, Model: mongoose.Model<T, object>): T;
}
export default class BaseFactory {
    protected static _checkKeysInModel<T extends Document>(
        keys: string | string[],
        model: mongoose.Model<T, object>,
        ignoreKeys: string | string[] = [],
    ): { result: boolean; message?: string } {
        const modelKeys = new Set(Object.keys(model.schema.paths).map(key => key.split('.')[0])); // Only get top layer keys for comparison. Could be nice to do n layer object validation?

        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        if (!Array.isArray(ignoreKeys)) {
            keys = [ignoreKeys];
        }

        const errorKeys: string[] = [];
        for (let i = 0; i < keys.length; i++) {
            if (!modelKeys.has(keys[i]) && !ignoreKeys.includes(keys[i])) {
                errorKeys.push(`Property: ${keys[i]} does not exist on ${model.modelName}`);
            }
        }

        return {
            result: errorKeys.length === 0,
            message: errorKeys.join(', '),
        };
    }

    public static generate<T extends Document>(doc: Partial<T>, Model: mongoose.Model<T, object>): T {
        const result = this._checkKeysInModel<T>(Object.keys(doc), Model);
        if (result.result) {
            return new Model(doc); // TODO: Needs testing...
        } else {
            throw Error(`Invalid data for ${typeof Model} generation`); // TODO: Not sure if this error will be correct. Potentiall use .name
        }
    }
}
