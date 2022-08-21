export class Storage {
  private constructor() {}

  public static get<T>(
    key: string,
    defaultValue: T | undefined = undefined
  ): T | undefined {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    return JSON.parse(item) as T;
  }

  public static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export enum Keys {
  UnlockedLevels = "unlockedLevels",
}
