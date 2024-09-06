// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { objFromArray } from "@/utils/obj-from-array";

// interface Email {
//   id: string;
// }

// interface MailState {
//   emails: {
//     byId: Record<string, Email>;
//     allIds: string[];
//   };
//   labels: string[];
// }

// const initialState: MailState = {
//   emails: {
//     byId: {},
//     allIds: [],
//   },
//   labels: [],
// };

// interface GetLabelsPayload {
//   labels: string[];
// }

// interface GetEmailsPayload {
//   emails: Email[];
// }

// interface GetEmailPayload {
//   email: Email;
// }

// const reducers = {
//   getLabels(state: MailState, action: PayloadAction<GetLabelsPayload>) {
//     state.labels = action.payload.labels;
//   },
//   getEmails(state: MailState, action: PayloadAction<GetEmailsPayload>) {
//     const emails = action.payload.emails;

//     state.emails.byId = objFromArray(emails);
//     state.emails.allIds = Object.keys(state.emails.byId);
//   },
//   getEmail(state: MailState, action: PayloadAction<GetEmailPayload>) {
//     const email = action.payload.email;

//     state.emails.byId[email.id] = email;

//     if (!state.emails.allIds.includes(email.id)) {
//       state.emails.allIds.push(email.id);
//     }
//   },
// };

// export const slice = createSlice({
//   name: "mail",
//   initialState,
//   reducers,
// });

// export const { reducer } = slice;
