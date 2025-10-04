import type { Driver } from "../../types.ts";

type DriverFactory<OptionsT> = (opts: OptionsT) => Driver;

export function defineDriver<OptionsT = any>(
  factory: DriverFactory<OptionsT>,
): DriverFactory<OptionsT> {
  return factory;
}
