// Configuration is optional for this custom element
// No specific config required - all settings are via environment variables
export type Config = Readonly<Record<string, unknown>>;

export const isConfig = (_value: Readonly<Record<string, unknown>> | null): _value is Config =>
  true;
