// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { objFromArray } from "../utils/obj-from-array";

// interface Column {
//   id: string;
//   taskIds: string[];
// }

// interface Task {
//   id: string;
//   columnId: string;
//   comments: string[];
//   checklists: Checklist[];
// }

// interface Checklist {
//   id: string;
//   checkItems: CheckItem[];
// }

// interface CheckItem {
//   id: string;
// }

// interface KanbanState {
//   isLoaded: boolean;
//   columns: {
//     byId: Record<string, Column>;
//     allIds: string[];
//   };
//   tasks: {
//     byId: Record<string, Task>;
//     allIds: string[];
//   };
//   members: {
//     byId: Record<string, any>;
//     allIds: string[];
//   };
// }

// const initialState: KanbanState = {
//   isLoaded: false,
//   columns: {
//     byId: {},
//     allIds: [],
//   },
//   tasks: {
//     byId: {},
//     allIds: [],
//   },
//   members: {
//     byId: {},
//     allIds: [],
//   },
// };

// interface GetBoardPayload {
//   columns: Column[];
//   tasks: Task[];
//   members: any[];
// }

// interface CreateColumnPayload {
//   id: string;
//   taskIds: string[];
// }

// interface UpdateColumnPayload extends Column {}

// interface ClearColumnPayload {
//   columnId: string;
// }

// interface DeleteColumnPayload {
//   columnId: string;
// }

// interface CreateTaskPayload {
//   id: string;
//   columnId: string;
//   comments: string[];
//   checklists: Checklist[];
// }

// interface UpdateTaskPayload extends Task {}

// interface MoveTaskPayload {
//   taskId: string;
//   position: number;
//   columnId?: string;
// }

// interface DeleteTaskPayload {
//   taskId: string;
// }

// interface AddCommentPayload {
//   taskId: string;
//   comment: string;
// }

// interface AddChecklistPayload {
//   taskId: string;
//   checklist: Checklist;
// }

// interface UpdateChecklistPayload {
//   taskId: string;
//   checklist: Checklist;
// }

// interface DeleteChecklistPayload {
//   taskId: string;
//   checklistId: string;
// }

// interface AddCheckItemPayload {
//   taskId: string;
//   checklistId: string;
//   checkItem: CheckItem;
// }

// interface UpdateCheckItemPayload {
//   taskId: string;
//   checklistId: string;
//   checkItem: CheckItem;
// }

// interface DeleteCheckItemPayload {
//   taskId: string;
//   checklistId: string;
//   checkItemId: string;
// }

// const reducers = {
//   getBoard(state: KanbanState, action: PayloadAction<GetBoardPayload>) {
//     const board = action.payload;

//     state.columns.byId = objFromArray(board.columns);
//     state.columns.allIds = Object.keys(state.columns.byId);
//     state.tasks.byId = objFromArray(board.tasks);
//     state.tasks.allIds = Object.keys(state.tasks.byId);
//     state.members.byId = objFromArray(board.members);
//     state.members.allIds = Object.keys(state.members.byId);
//     state.isLoaded = true;
//   },
//   createColumn(state: KanbanState, action: PayloadAction<CreateColumnPayload>) {
//     const column = action.payload;

//     state.columns.byId[column.id] = column;
//     state.columns.allIds.push(column.id);
//   },
//   updateColumn(state: KanbanState, action: PayloadAction<UpdateColumnPayload>) {
//     const column = action.payload;

//     state.columns.byId[column.id] = column;
//   },
//   clearColumn(state: KanbanState, action: PayloadAction<ClearColumnPayload>) {
//     const columnId = action.payload.columnId;

//     const { taskIds } = state.columns.byId[columnId];

//     state.columns.byId[columnId].taskIds = [];

//     taskIds.forEach((taskId) => {
//       delete state.tasks.byId[taskId];
//     });

//     state.tasks.allIds = state.tasks.allIds.filter(
//       (taskId) => !taskIds.includes(taskId)
//     );
//   },
//   deleteColumn(state: KanbanState, action: PayloadAction<DeleteColumnPayload>) {
//     const columnId = action.payload.columnId;

//     delete state.columns.byId[columnId];
//     state.columns.allIds = state.columns.allIds.filter(
//       (_columnId) => _columnId !== columnId
//     );
//   },
//   createTask(state: KanbanState, action: PayloadAction<CreateTaskPayload>) {
//     const task = action.payload;

//     state.tasks.byId[task.id] = task;
//     state.tasks.allIds.push(task.id);

//     state.columns.byId[task.columnId].taskIds.push(task.id);
//   },
//   updateTask(state: KanbanState, action: PayloadAction<UpdateTaskPayload>) {
//     const task = action.payload;

//     Object.assign(state.tasks.byId[task.id], task);
//   },
//   moveTask(state: KanbanState, action: PayloadAction<MoveTaskPayload>) {
//     const { taskId, position, columnId } = action.payload;
//     const sourceColumnId = state.tasks.byId[taskId].columnId;

//     state.columns.byId[sourceColumnId].taskIds = state.columns.byId[
//       sourceColumnId
//     ].taskIds.filter((_taskId) => _taskId !== taskId);

//     if (columnId) {
//       state.tasks.byId[taskId].columnId = columnId;
//       state.columns.byId[columnId].taskIds.splice(position, 0, taskId);
//     } else {
//       state.columns.byId[sourceColumnId].taskIds.splice(position, 0, taskId);
//     }
//   },
//   deleteTask(state: KanbanState, action: PayloadAction<DeleteTaskPayload>) {
//     const taskId = action.payload.taskId;
//     const { columnId } = state.tasks.byId[taskId];

//     delete state.tasks.byId[taskId];
//     state.tasks.allIds = state.tasks.allIds.filter(
//       (_taskId) => _taskId !== taskId
//     );
//     state.columns.byId[columnId].taskIds = state.columns.byId[
//       columnId
//     ].taskIds.filter((_taskId) => _taskId !== taskId);
//   },
//   addComment(state: KanbanState, action: PayloadAction<AddCommentPayload>) {
//     const { taskId, comment } = action.payload;
//     const task = state.tasks.byId[taskId];

//     task.comments.push(comment);
//   },
//   addChecklist(state: KanbanState, action: PayloadAction<AddChecklistPayload>) {
//     const { taskId, checklist } = action.payload;
//     const task = state.tasks.byId[taskId];

//     task.checklists.push(checklist);
//   },
//   updateChecklist(
//     state: KanbanState,
//     action: PayloadAction<UpdateChecklistPayload>
//   ) {
//     const { taskId, checklist } = action.payload;
//     const task = state.tasks.byId[taskId];

//     task.checklists = task.checklists.map((_checklist) => {
//       if (_checklist.id === checklist.id) {
//         return checklist;
//       }

//       return _checklist;
//     });
//   },
//   deleteChecklist(
//     state: KanbanState,
//     action: PayloadAction<DeleteChecklistPayload>
//   ) {
//     const { taskId, checklistId } = action.payload;
//     const task = state.tasks.byId[taskId];

//     task.checklists = task.checklists.filter(
//       (checklist) => checklist.id !== checklistId
//     );
//   },
//   addCheckItem(state: KanbanState, action: PayloadAction<AddCheckItemPayload>) {
//     const { taskId, checklistId, checkItem } = action.payload;
//     const task = state.tasks.byId[taskId];
//     const checklist = task.checklists.find(
//       (checklist) => checklist.id === checklistId
//     );

//     if (!checklist) {
//       return;
//     }

//     checklist.checkItems.push(checkItem);
//   },
//   updateCheckItem(
//     state: KanbanState,
//     action: PayloadAction<UpdateCheckItemPayload>
//   ) {
//     const { taskId, checklistId, checkItem } = action.payload;
//     const task = state.tasks.byId[taskId];
//     const checklist = task.checklists.find(
//       (checklist) => checklist.id === checklistId
//     );

//     if (!checklist) {
//       return;
//     }

//     checklist.checkItems = checklist.checkItems.map((_checkItem) => {
//       if (_checkItem.id === checkItem.id) {
//         return checkItem;
//       }

//       return _checkItem;
//     });
//   },
//   deleteCheckItem(
//     state: KanbanState,
//     action: PayloadAction<DeleteCheckItemPayload>
//   ) {
//     const { taskId, checklistId, checkItemId } = action.payload;
//     const task = state.tasks.byId[taskId];
//     const checklist = task.checklists.find(
//       (_checklist) => _checklist.id === checklistId
//     );

//     if (!checklist) {
//       return;
//     }

//     checklist.checkItems = checklist.checkItems.filter(
//       (checkItem) => checkItem.id !== checkItemId
//     );
//   },
// };

// export const slice = createSlice({
//   name: "kanban",
//   initialState,
//   reducers,
// });

// export const { reducer } = slice;
