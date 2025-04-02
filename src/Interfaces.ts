export enum UserRoleEnum {
  Simple,
  Administrator
}
export interface IUserModel extends BaseAuditEntity {
  id: number;
  userName: string;
  role: UserRoleEnum;
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
  type?: number;
  city: string;
  description: string | null;
  latitude: number;
  longitude: number;
  images: string[];
  distance?: number;
  medieReview?: number;
}
export interface IObjectivesStore {
  selectedObjective: IObjective;
  objectives: IObjective[];
}
export interface IServiceResult {
  isSuccesful: boolean;
  result: any;
  validationMessage: string[];
}
export interface IEvent extends BaseAuditEntity {
  id: number;
  name: string;
  description?: string;
  country?: string;
  city?: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: Date;
  endDate: Date;
  idObjective?: number | null;
  objective?: IObjective | null;
  images: string[];
}
export interface IPhotoGalleria {
  itemImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
  title: string;
}
export interface IReview extends BaseAuditEntity {
  id?: number;
  raiting: number;
  comment: string;
  idObjective: number;
  objective?: IObjective;
  user?: IUserModel;
  idUser: number;
}
export interface IExperience extends BaseAuditEntity {
  id: number;
  title: string;
  description: string;
  location: string;
  date: Date;
  images: string[];
  latitude?: number;
  longitude?: number;
}
export interface IItineraryStore {
  itineraries: IItinerary[]
  selectedItinerary: IItinerary
  selectedItineraryDTO: IItineraryDTO
  search:string
}
export interface IItinerary {
  id?:number;
  name: string;
  description: string;
  idObjectives: number[];
  idEvents: number[];
  idUser?: number;
}
export interface IItineraryDTO {
  id?: number;
  name: string;
  description: string;
  objectivesIds: number[];
  idUser?: number;
  eventsIds: number[];
}
export interface IObjectiveType extends BaseAuditEntity {
  id: number;
  name: string;
  description: string;  
}
export interface ObjectiveFilterModel {
  latitude: number | null;
  longitude: number | null;
  maxDistance: number | null;
  name: string | null;
  typeId?: number | null;
  minRating: number | null;
}
export interface IItineraryDetail {
  id?: number;
  name: string;
  descriere: string;
  idObjective?: number;
  idEvent?: number;
  visitOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItinerary {
  id?: number;
  name: string;
  description: string;
  idUser?: number;
  itineraryDetails: IItineraryDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IItineraryDetail {
  id?: number;
  name: string;
  descriere: string;
  idObjective?: number;
  idEvent?: number;
  visitOrder: number;
}

export interface IItineraryDTO {
  id?: number;
  name: string;
  description: string;
  idUser?: number;
  itineraryDetails: IItineraryDetail[];
}

export interface IItineraryPageDTO {
  id: number;
  name: string;
  description: string;
  idUser: number;
  itineraryDetails: IItineraryDetail[];
  createdAt: Date;
  updatedAt: Date;
  objectivesIds: number[];
  eventsIds: number[];
}
