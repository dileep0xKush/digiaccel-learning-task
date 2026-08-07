export function cn(...classes: (string | undefined | null | false)[]): string {
  const classList = classes.filter(Boolean).join(' ');
  const parts = classList.split(' ');

  const classMap = new Map<string, string>();

  parts.forEach((cls) => {
    const match = cls.match(/^([a-z-]+)/);
    if (match) {
      const prefix = match[1];
      classMap.set(prefix, cls);
    }
  });

  return Array.from(classMap.values()).join(' ');
}
