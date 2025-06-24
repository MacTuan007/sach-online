export interface NXBWithOutId {
    ten: string;
    tenlink: string;
}
export interface NXB extends NXBWithOutId {
    id: string;
}