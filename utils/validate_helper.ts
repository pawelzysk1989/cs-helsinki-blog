import { filter, first, isTruthy, map, pipe } from 'remeda';

type ValidationError = {
  error: string;
};
type Validator<T> = (value: T) => null | undefined | ValidationError;

const validate = <T>(value: T, validators: Validator<T>[]): ReturnType<Validator<T>> =>
  pipe(
    validators,
    map((validator) => validator(value)),
    filter(isTruthy),
    first(),
  );

const minLength =
  ({ length, name }: { length: number; name: string }): Validator<string> =>
  (value) =>
    value.length < length
      ? {
          error: `${name} must be at least ${length} characters long.`,
        }
      : null;

export default {
  validate,
  minLength,
};
