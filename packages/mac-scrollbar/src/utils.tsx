export function handleExtractSize(target: HTMLDivElement) {
  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = target;
  return {
    offsetWidth,
    scrollWidth,
    offsetHeight,
    scrollHeight,
  };
}

export function classNames(...args: (string | Record<string, unknown>)[]) {
  return args
    .flatMap((item) =>
      typeof item === 'object' ? Object.keys(item).map((n) => (item[n] ? n : undefined)) : item,
    )
    .join(' ');
}
