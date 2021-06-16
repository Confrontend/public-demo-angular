export interface IMenuItem {
  title: string;
  path: string;
}

export interface IUser {
  id?: number | string;
  name: string;
  city?: string;
  email: string;
}

export interface IGroup {
  id?: string;
  name: string;
  desc?: string;
}

export interface IAssignmentApi {
  id?: string;
  userId: string;
  groupId: string;
}

export interface IAssignment {
  groupName: string;
  userNames: string[];
}
