export enum UserRoleEnum{
  Simple,
  Administrator
}
export interface IUserModel extends BaseAuditEntity {
  id: number;
  userName: string;
  role:UserRoleEnum;
  email: string | null;
  phone: string | null;
  hash: string;
  salt: string;
}
export interface BaseAuditEntity {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IObjective extends BaseAuditEntity {
  id: number;
  name: string;
  city: string;
  description: string | null;
  latitude: number;
  longitude: number;
  images: string[];
}
export interface IObjectivesStore {
  selectedObjective: IObjective;
  objectives: IObjective[];
}
export interface IServiceResult {
  isSuccesful: boolean;
  result: any;
}
