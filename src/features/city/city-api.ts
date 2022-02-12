import type { CityLive, CityStat } from "@features/city/city-type";

const CityApi = {
  live: (cityId) => ({
    url: `/domestic/${cityId}/live`,
    _t: {} as CityLive,
  }),
  stat: (cityId) => ({
    url: `/domestic/${cityId}/stat`,
    _t: {} as CityStat,
  }),
};

export default CityApi;
