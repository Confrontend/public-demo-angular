import * as _ from 'lodash';

export function groupBy<T>(data: T[], by: string, group: string) {
  return _.chain(data)
    .groupBy(by)
    .map((value, key) => ({ [by]: key, [group]: value }))
    .value();
}
