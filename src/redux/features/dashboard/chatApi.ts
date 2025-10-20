import { baseApi } from "@/redux/api/baseApi";

// === Define Interfaces ===

// Participant details
export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
}

// === Conversation List Types ===

// Last message details (used in conversation list)
export interface LastMessage {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  images: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Conversation item (used in conversation list)
export interface Conversation {
  roomId: string;
  participants: {
    sender: ChatUser;
    receiver: ChatUser;
  };
  lastMessage: LastMessage;
  unreadCount: number;
}

// Response for getting all conversations
export interface GetConversationsResponse {
  success: boolean;
  message: string;
  data: Conversation[];
}

// === Single Conversation Details Types ===

// Message details (used inside single conversation)
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  images: string[];
  isRead: boolean;
  createdAt: string;
}

// Full single conversation response
export interface ConversationDetail {
  roomId: string;
  totalMessages: number;
  unreadCount: number;
  participants: {
    sender: ChatUser;
    receiver: ChatUser;
  };
  messages: ChatMessage[];
}

export interface GetConversationDetailResponse {
  success: boolean;
  message: string;
  data: ConversationDetail;
}

// === API Endpoints ===
export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all conversations
    getConversations: build.query<GetConversationsResponse, void>({
      query: () => ({
        url: "/admin/conversation",
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    // ✅ GET a single conversation by roomId (with messages)
    getConversationById: build.query<GetConversationDetailResponse, string>({
      query: (roomId) => ({
        url: `/admin/conversation/${roomId}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

// === Export Hooks ===
export const {
  useGetConversationsQuery,
  useGetConversationByIdQuery,
} = chatApi;
