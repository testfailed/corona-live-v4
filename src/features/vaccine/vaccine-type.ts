export type VaccineType = "az" | "pfizer" | "jansen" | "astrazeneca";

export interface VaccineStat {
  overview: {
    partiallyVaccinated: {
      total: number;
      delta: number;
      rates: number;
      over18rates: number;
      over60rates: number;
    };
    fullyVaccinated: {
      total: number;
      delta: number;
      rates: number;
      over18rates: number;
      over60rates: number;
    };
    booster: {
      total: number;
      delta: number;
      rates: number;
      over18rates: number;
      over60rates: number;
    };
  };
}

export type VaccineInfo = Record<VaccineType, [string, string][]>;
