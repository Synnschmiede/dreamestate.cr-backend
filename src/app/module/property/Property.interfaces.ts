import { PropertyStatus, PropertyType } from "@prisma/client";
import { TFile } from "../File/File.interfaces";

export interface PropertyContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface IPropertyLocation {
  city: string;
  state: string;
  country: string;
  street: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
}

export interface IPropertyDetails {
  area_size: number;
  bedroom?: number;
  bathroom?: string;
  garage?: number;
  available_from?: string;
  property_lot_size?: string;
  year_build?: string;
  structure_type?: string;
  price_info?: string;
  room?: number;
  garage_size?: string;
}

export interface IPropertyFeatures {
  interior_details?: string[];
  outdoor_details?: string[];
  utilities?: string[];
  other_features?: string[];
}

export interface IProperty {
  title: string;
  description?: string;
  price: number;
  property_type?: PropertyType;
  status?: PropertyStatus;
  tags?: string[];
  contact_info?: PropertyContactInfo;
  location?: IPropertyLocation;
  property_details?: IPropertyDetails;
  features?: IPropertyFeatures;
  feature_image?: string;
  images?: string[];
}

export type TPropertyFiles = {
  feature_image?: TFile[];
  images?: TFile[];
};
