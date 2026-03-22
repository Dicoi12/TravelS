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
}
export interface BaseAuditEntity {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IObjectiveType extends BaseAuditEntity {
  id: number;
  name: string;
  description: string;
}
export interface IObjective extends BaseAuditEntity {
  id: number;
  name: string;
  type?: number;
  objectiveType?: IObjectiveType | null;
  city: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  website?: string | null;
  interval?: string | null;
  pret?: string | null;
  images: string[];
  distance?: number;
  medieReview?: number;
  formattedDistance?: string;
  duration?: number | null;
  reviews?: IReview[];
}
export interface IObjectivesStore {
  selectedObjective: IObjective;
  objectives: IObjective[];
}
export interface IServiceResult<T = any> {
  isSuccessful: boolean;
  result: T;
  validationMessage: string | null;
}
export interface IObjectiveImage {
  id: number;
  filePath: string;
  imageMimeType: string;
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
  datePosted?: string;
}
export interface IExperience extends BaseAuditEntity {
  id: number;
  name?: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  locationName?: string;
  rating?: number;
  images: string[];
  isPublic: boolean;
}
export interface IItineraryStore {
  itineraries: IItinerary[]
  selectedItinerary: IItinerary
  selectedItineraryDTO: IItineraryDTO
  search: string
}
export interface IItineraryDTO {
  id?: number;
  name: string;
  description: string;
  idUser?: number;
  dataStart?: string;
  dataStop?: string;
  itineraryDetails: IItineraryDetail[];
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
  id: number;
  idObjective?: number | null;
  objective?: IObjective | null;
  idEvent?: number | null;
  event?: IEvent | null;
  visitOrder: number;
  idItinerary: number;
  images: string[];
  name: string;
  descriere?: string | null;
  date?: Date | null;
  estimatedTime?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItinerary {
  id: number;
  name: string;
  description: string;
  idUser?: number | null;
  dataStart?: Date | null;
  dataStop?: Date | null;
  itineraryDetails: IItineraryDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IItineraryPageDTO {
  id: number;
  name: string;
  description: string;
  idUser?: number | null;
  dataStart?: string | null;
  dataStop?: string | null;
  itineraryDetails: IItineraryDetail[];
}
export interface ItineraryFilterModel {
  latitude: number | null;
  longitude: number | null;
  maxDistance: number | null;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  minRating: number | null;
}
export interface IToken {
  token: string;
}
export interface RecommendedObjectiveDto {
  id: number;
  name: string;
  city: string;
  firstImageUrl: string | null;
  averageRating: number | null;
}
export interface IPagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
