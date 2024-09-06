// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { objFromArray } from "@/utils/obj-from-array";

// interface Contact {
//   id: string;
// }

// interface Thread {
//   id: string;
//   unreadCount: number;
//   messages: any[];
// }

// interface ContactsState {
//   byId: Record<string, Contact>;
//   allIds: string[];
// }

// interface ThreadsState {
//   byId: Record<string, Thread>;
//   allIds: string[];
// }

// interface ChatState {
//   contacts: ContactsState;
//   currentThreadId?: string;
//   threads: ThreadsState;
// }

// const initialState: ChatState = {
//   contacts: {
//     byId: {},
//     allIds: [],
//   },
//   currentThreadId: undefined,
//   threads: {
//     byId: {},
//     allIds: [],
//   },
// };

// const reducers = {
//   getContacts(state: ChatState, action: PayloadAction<Contact[]>) {
//     const contacts = action.payload;

//     state.contacts.byId = objFromArray(contacts);
//     state.contacts.allIds = Object.keys(state.contacts.byId);
//   },
//   getThreads(state: ChatState, action: PayloadAction<Thread[]>) {
//     const threads = action.payload;

//     state.threads.byId = objFromArray(threads);
//     state.threads.allIds = Object.keys(state.threads.byId);
//   },
//   getThread(state: ChatState, action: PayloadAction<Thread | null>) {
//     const thread = action.payload;

//     if (thread) {
//       state.threads.byId[thread.id] = thread;

//       if (!state.threads.allIds.includes(thread.id)) {
//         state.threads.allIds.unshift(thread.id);
//       }
//     }
//   },
//   markThreadAsSeen(state: ChatState, action: PayloadAction<string>) {
//     const threadId = action.payload;
//     const thread = state.threads.byId[threadId];

//     if (thread) {
//       thread.unreadCount = 0;
//     }
//   },
//   setCurrentThread(
//     state: ChatState,
//     action: PayloadAction<string | undefined>
//   ) {
//     state.currentThreadId = action.payload;
//   },
//   addMessage(
//     state: ChatState,
//     action: PayloadAction<{ threadId: string; message: any }>
//   ) {
//     const { threadId, message } = action.payload;
//     const thread = state.threads.byId[threadId];

//     if (thread) {
//       thread.messages.push(message);
//     }
//   },
// };

// export const slice = createSlice({
//   name: "chat",
//   initialState,
//   reducers,
// });

// export const { reducer } = slice;
