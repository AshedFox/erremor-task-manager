import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Match<T>(
  _type: ClassConstructor<T>,
  property: keyof T,
  validationOptions?: ValidationOptions
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          const relatedValue = (args.object as any)[relatedProperty];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperty] = args.constraints;
          return `${args.property} must match ${relatedProperty}`;
        },
      },
    });
  };
}
