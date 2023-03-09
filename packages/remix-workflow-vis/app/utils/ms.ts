export interface TimeDescriptor {
  readonly days?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly microseconds?: number;
  readonly nanoseconds?: number;
}

export function toMs(desc: TimeDescriptor): number {
  return toMilliseconds(desc);
}

export function toSeconds(desc: TimeDescriptor): number {
  return Math.ceil(toMilliseconds(desc) / 1000);
}

const converters = {
  days: (value: number) => value * 864e5,
  hours: (value: number) => value * 36e5,
  minutes: (value: number) => value * 6e4,
  seconds: (value: number) => value * 1e3,
  milliseconds: (value: number) => value,
  microseconds: (value: number) => value / 1e3,
  nanoseconds: (value: number) => value / 1e6,
} as const;

type ConverterKeys = keyof typeof converters;
const converterKeys = Object.keys(converters) as ConverterKeys[];
function isConverterKey(key: string): key is ConverterKeys {
  return converterKeys.includes(key as ConverterKeys);
}

function toMilliseconds(timeDescriptor: TimeDescriptor) {
  let totalMilliseconds = 0;

  for (const [key, value] of Object.entries(timeDescriptor)) {
    if (typeof value !== "number") {
      throw new TypeError(
        `Expected a \`number\` for key \`${key}\`, got \`${value}\` (${typeof value})`
      );
    }
    if (!isConverterKey(key)) {
      throw new Error(`Unsupported time key: ${key}`);
    }
    const converter = converters[key];

    if (!converter) {
      throw new Error(`Unsupported time key: ${key}`);
    }

    totalMilliseconds += converter(value);
  }

  return totalMilliseconds;
}
