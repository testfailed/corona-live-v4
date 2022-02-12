import type { VaccineInfo, VaccineStat } from "@features/vaccine/vaccine-type";

const VaccinApi = {
  stat: {
    url: "/vaccine",
    _t: {} as VaccineStat,
  },
  info: {
    url: "/vaccine/info",
    _t: {} as VaccineInfo,
  },
};

export default VaccinApi;
