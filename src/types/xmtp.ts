import { Conversation } from "@xmtp/xmtp-js";

export interface ConversationWithTitle extends Conversation {
  title: string;
}
