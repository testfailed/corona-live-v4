export interface SocialDistancing {
  date: string;
  cities: {
    [cityId: string]: {
      level: number;
      from: string;
      to: string;
    };
  };
}

export type SocialDistancingLevel = 1 | 2 | 3 | 4;
