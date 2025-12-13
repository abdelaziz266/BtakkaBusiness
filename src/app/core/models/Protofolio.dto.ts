export interface IProtfolioDto {
    id: 0,
    title: string,
    path: string,
    isMain: true
}

export interface IPortfolioImageDto {
    id: number;
    title: string;
    details: string | null;
    path: string;
    isMain: boolean;
}

export interface IGetPortfolioDetailsDto {
    id: number;
    title: string;
    details: string | null;
    images: IPortfolioImageDto[];
}