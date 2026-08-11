export type StatusOfDeparture =
    | 'ON_TIME'
    | 'DELAYED_BY_5_MINUTES'
    | 'DELAYED_BY_15_MINUTES'
    | 'DELAYED_BY_30_MINUTES'
    | 'DELAYED_BY_45_MINUTES'
    | 'DELAYED_BY_60_MINUTES'
    | 'DELAYED_BY_600_MINUTES';

export interface JoinedDeparture {
    tripId: number;
    trainLine: string;
    destination: string;
    scheduledTime: string;
    actualTime: string;
    delay: number;
    statusOfDeparture: StatusOfDeparture;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string;
    errorDate: string;
}
