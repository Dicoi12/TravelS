export interface IUserModel extends BaseAuditEntity {
  id: number;
  userName: string;
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
    description: string | null;
    latitude: number;
    longitude: number;
}
export interface IObjectivesStore{
  selectedObjective:IObjective;
  objectives:IObjective[];
}