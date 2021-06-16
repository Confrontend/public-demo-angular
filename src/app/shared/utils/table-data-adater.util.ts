import { IUser } from '../shared-interfaces';

export function usersToTable(users: IUser[]): IUser[] {
  return users
    .filter((user: IUser) => !!users)
    .map((user: IUser) => ({
      ...user,
      city: user.city ? user.city : 'city unknown',
    }));
}

export function groupsToTable() {}
