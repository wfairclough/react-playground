export interface TimeDescriptor {
  readonly days?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly microseconds?: number;
  readonly nanoseconds?: number;
}

/**
Convert an object of time properties to milliseconds: `{seconds: 2}` → `2000`.
@example
```
import { toMs } from '~/utils/ms';
toMs({
	days: 15,
	hours: 11,
	minutes: 23,
	seconds: 20,
	milliseconds: 1
});
//=> 1337000001
setTimeout(() => {
	// …
}, toMs({minutes: 2}));
```
*/
export function toMs(desc: TimeDescriptor): number {
  return toMilliseconds(desc);
}

/**
Convert an object of time properties to seconds: `{hours: 2}` → `72000`.
@example
```
import { toSeconds } from '~/utils/ms';
toMs({
	days: 15,
	hours: 11,
	minutes: 23,
	seconds: 20
});
//=> 1337000
```
*/
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
    if (typeof value !== 'number') {
      throw new TypeError(`Expected a \`number\` for key \`${key}\`, got \`${value}\` (${typeof value})`);
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
