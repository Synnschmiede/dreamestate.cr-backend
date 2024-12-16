interface IPropertyLocation {
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    addressLine1?: string;
    addressLine2?: string;
    latitude?: number;
    longitude?: number;
}

interface PropertyContactInfo {
    name: string;
    email: string;
    phone?: string;

}

interface IPropertyOverview {
    updated_on: string;
    bedrooms: number;
    bathrooms: number;
    area_size: number;
    garage: number;
}

interface IPropertyDetails {
    id: string;
    size: number;
    bedrooms: number;
    garage: number;
    available_from: string;
    price: number;
    property_lot_size: string;
    bathrooms: string;
    year_build: string;
    structure_type: string;
    price_info: string;
    rooms: number;
    garage_size: string;
}

export interface IProperty {
    title: string;
    description: string;
    price: number;
    feature_image: string;
    property_type: "APARTMENT" | "HOUSE" | "VILLA" | "LAND";
    status: "AVAILABLE" | "SOLD" | "RENTED";
    images?: string[];
    tags?: string[];
    overview?: IPropertyOverview;
    contactInfo: PropertyContactInfo;
    documents?: string[];
    location?: IPropertyLocation;
    property_details?: IPropertyDetails;
    features?: {
        interior_details: string[];
        outdoor_details: string[];
        utilities: string[];
        other_features: string[];
    };
}