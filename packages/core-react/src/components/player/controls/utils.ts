export const getFormattedHoursMinutesSeconds = (
  valueInSeconds: number | undefined | null,
) => {
  if (
    valueInSeconds !== undefined &&
    valueInSeconds !== null &&
    !isNaN(valueInSeconds) &&
    isFinite(valueInSeconds)
  ) {
    const roundedValue = Math.round(valueInSeconds);

    const hours = Math.floor(roundedValue / 3600);
    const seconds = Math.floor(roundedValue % 60);

    if (hours > 0) {
      const minutes = Math.floor((roundedValue % 3600) / 60);

      return `${hours}:${minutes.toString().padStart(2, '0')}:${
        seconds < 10 ? '0' : ''
      }${seconds}`;
    }

    const minutes = Math.floor(roundedValue / 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return `0:00`;
};
