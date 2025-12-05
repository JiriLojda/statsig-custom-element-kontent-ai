// The value stores the Statsig experiment ID
export type Value = Readonly<{
  experimentId: string;
}>;

export const parseValue = (input: string | null): Value | null | "invalidValue" => {
  if (input === null) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(input);

    return isValidValue(parsedValue) ? parsedValue : "invalidValue";
  }
  catch {
    return "invalidValue";
  }
};

const isValidValue = (obj: Readonly<Record<string, unknown>>): obj is Value =>
  typeof obj === "object" && obj !== null && "experimentId" in obj && typeof obj.experimentId === "string";
