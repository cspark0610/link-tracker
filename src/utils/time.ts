import dayjs from 'dayjs';

export class Time {
  static getExpirationTimeMs(ms): number {
    return dayjs().add(ms, 'milliseconds').valueOf();
  }
}
