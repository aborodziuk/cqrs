import 'reflect-metadata';
import { EVENT_METADATA } from "./constants";

export const Event = (): ClassDecorator => {
    return (target: object) => {
        Reflect.defineMetadata(EVENT_METADATA, target.constructor.name, target);
    };
};
