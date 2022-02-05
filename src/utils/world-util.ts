import { UpdateRow } from "@components/updates/Updates_Row";
import { COUNTRY_NAMES } from "@constants/constants";
import { boldify } from "@utils/html-util";
import { WorldUpdate } from "@_types/world-type";

export const transformWorldUpdates = (
  updates: Array<WorldUpdate>
): Array<UpdateRow> => {
  if (Array.isArray(updates) === false) return null;

  return updates.map(({ cases, datetime, countryId }) => ({
    date: datetime,
    update: `${boldify(COUNTRY_NAMES[countryId] ?? "")} ${cases}명 추가 확진`,
  }));
};
