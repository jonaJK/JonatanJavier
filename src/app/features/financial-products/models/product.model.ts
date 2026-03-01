export interface Product {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
}

export interface ProductForm {
    productId: string;
    name: string;
    description: string;
    logo: string;
    releaseDate: Date | null;
    reviewDate: Date | null;
}
