// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Event {
//   id: string;
//   title: string;
//   date: string;
// }

// interface CalendarState {
//   events: Event[];
// }

// const initialState: CalendarState = {
//   events: [],
// };

// const reducers = {
//   getEvents(state: CalendarState, action: PayloadAction<Event[]>) {
//     state.events = action.payload;
//   },
//   createEvent(state: CalendarState, action: PayloadAction<Event>) {
//     state.events.push(action.payload);
//   },
//   updateEvent(state: CalendarState, action: PayloadAction<Event>) {
//     const event = action.payload;

//     state.events = state.events.map((_event) => {
//       if (_event.id === event.id) {
//         return event;
//       }
//       return _event;
//     });
//   },
//   deleteEvent(state: CalendarState, action: PayloadAction<string>) {
//     state.events = state.events.filter((event) => event.id !== action.payload);
//   },
// };

// const slice = createSlice({
//   name: "calendar",
//   initialState,
//   reducers,
// });

// export const { reducer } = slice;
