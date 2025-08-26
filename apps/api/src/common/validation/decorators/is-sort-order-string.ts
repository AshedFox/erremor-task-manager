import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSortOrderString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsSortOrderString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' && (value === 'asc' || value === 'desc')
          );
        },
        defaultMessage() {
          return 'Sort order must be either "asc" or "desc"';
        },
      },
    });
  };
}
