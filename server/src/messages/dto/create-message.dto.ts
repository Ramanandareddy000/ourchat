export interface CreateMessageDto {
  text: string;
  conversation_id: number;
  sender_id: number;
  attachment_url?: string;
}
