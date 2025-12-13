
export interface IGetFinishingInspectionRequest {
    id: number;
    customerName: string;
    unitTitle: string;
    unitAddress: string;
    phoneNumber: string;
    date: Date;
    followedUp: boolean;
}
