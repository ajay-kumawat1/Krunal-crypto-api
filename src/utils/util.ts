import { isValidObjectId } from 'mongoose';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
        return true;
    } else if (typeof value !== 'number' && value === '') {
        return true;
    } else if (typeof value === 'undefined' || value === undefined) {
        return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
        return true;
    } else {
        return false;
    }
};

/**
 * @method isObjectId
 * @param {String | Number } id
 * @returns {Boolean} true & false
 * @description this id is ObjectId Check
 */
export const isObjectId = (id: string | number): boolean => {
    if (id === null || typeof id === 'undefined' || id === undefined) {
        return false;
    } else if (!isValidObjectId(id)) {
        return false;
    } else {
        return true;
    }
};
