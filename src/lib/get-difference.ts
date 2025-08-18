import _ from "lodash";

export function getDifferences(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
) {
  return Object.keys(obj1).reduce((diff: Record<string, unknown>, key) => {
    if (!_.isEqual(obj1[key], obj2[key])) {
      diff[key] = obj2[key];
    }
    return diff;
  }, {});
}
