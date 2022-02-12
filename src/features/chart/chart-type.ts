export type ChartConditionType = "equal" | "not-equal";

export type ChartTypeOptionValue =
  | "live"
  | "daily"
  | "weekly"
  | "monthly"
  | "accumulated";

export type ChartRangeOptionValue =
  | "oneWeek"
  | "oneWeekExtra"
  | "twoWeeks"
  | "oneMonth"
  | "threeMonths"
  | "all";

export interface ChartDefaultOption {
  range: ChartRangeOptionValue;
  type: ChartTypeOptionValue;
}

export type ChartDefaultOptionKey = keyof ChartDefaultOption;

export interface OptionValue {
  label: string;
  disabled?: boolean;
  hidden?: boolean;
}

export type ChartOverrideOptions<
  Config extends {} = {},
  Option extends string = string
> = ("options" extends keyof Config
  ? {
      [Name in keyof Config["options"]]?: Partial<
        Record<keyof Config["options"][Name], OptionValue>
      >;
    }
  : {}) &
  Partial<Record<Option, Record<string, OptionValue>>> & {
    _?: any;
  };

export type ChartCondition<
  Config extends {} = {},
  Option extends string = string
> = ("options" extends keyof Config
  ? {
      [Name in keyof Config["options"]]?: keyof Config["options"][Name];
    }
  : {}) &
  Partial<Record<Option, string>> & {
    conditionType?: ChartConditionType;
    options: ChartOverrideOptions<Config, Option>;
  };

export type ChartStatOptions<
  Stat extends string = string,
  Option extends string = string,
  Config extends {} = {},
  ComposedOption extends string = Option | ChartDefaultOptionKey
> = Record<
  Stat,
  Config & {
    label: string;
    options: {
      [Name in ComposedOption]?: {
        [Value in string]: OptionValue;
      };
    };
    defaultOptions?: ("options" extends keyof Config
      ? {
          [Name in keyof Config["options"]]?: keyof Config["options"][Name];
        }
      : {}) &
      Partial<Record<ComposedOption, string>> & {
        _?: any;
      };
    overrideOptionsIf?: (("options" extends keyof Config
      ? {
          [Name in keyof Config["options"]]?: keyof Config["options"][Name];
        }
      : {}) &
      Partial<Record<ComposedOption, string>> & {
        equal?: true;
        options: ChartOverrideOptions<Config, ComposedOption>;
      })[];
  }
>;

export type ChartMode = "EXPANDED" | "DEFAULT";
