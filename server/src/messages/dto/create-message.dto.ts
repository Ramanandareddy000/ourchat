export interface CreateMessageDto {
  text: string;
  time: string;
  is_me: boolean;
  sender_id: number;
  sender_name?: string;
  receiver_id: number;
  is_group?: boolean;
}
