const RU_LOCALE = 'ru-RU';
const DEFAULT_TIME_ZONE = 'UTC';

const mergeOptions = (
  base: Intl.DateTimeFormatOptions,
  override?: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormatOptions => ({
  ...base,
  ...(override ?? {}),
});

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(
    RU_LOCALE,
    mergeOptions(
      {
        timeZone: DEFAULT_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
      options,
    ),
  ).format(date);

export const formatDateTime = (date: Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(
    RU_LOCALE,
    mergeOptions(
      {
        timeZone: DEFAULT_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
      options,
    ),
  ).format(date);
