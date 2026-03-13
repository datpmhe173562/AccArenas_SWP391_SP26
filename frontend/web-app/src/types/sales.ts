import { OrderDto } from "@/types/generated-api";

export interface InquiryMessageDto {
    id: string;
    senderUserId: string;
    senderName?: string;
    senderRole: string;
    content: string;
    createdAt: string;
}

export interface InquiryDto {
    id: string;
    orderId: string;
    subject: string;
    status: string;
    createdAt: string;
    messages: InquiryMessageDto[];
}

export interface FulfillmentEventDto {
    id: string;
    status: string;
    note?: string;
    createdByUserId: string;
    createdByName?: string;
    createdAt: string;
}

export type SalesOrder = OrderDto & {
    fulfillmentStatus?: string;
    assignedToSalesId?: string;
    assignedSalesName?: string;
    events?: FulfillmentEventDto[];
};
