import { createSlice } from "@reduxjs/toolkit";

interface ChartBuilderState {
  programId: string;
  projectId: string;
  isPreview: boolean;
  isPublished: boolean;
  widgetConfigs: Record<string, unknown>;
  childPayload: Record<string, unknown>;
}

const initialState: ChartBuilderState = {
  programId: "",
  projectId: "",
  isPreview: false,
  isPublished: false,
  widgetConfigs: {},
  childPayload: {},
};

const chartSlice = createSlice({
  name: "chartBuilder",
  initialState,
  reducers: {
    setProgramId: (state, action) => {
      state.programId = action.payload;
    },
    setProjectId: (state, action) => {
      state.projectId = action.payload;
    },
    setIsPreview: (state, action) => {
      state.isPreview = action.payload;
    },
    setIsPublished: (state, action) => {
      state.isPublished = action.payload;
    },
    setWidgetConfig: (
      state,
      action: { payload: { id: string; config: unknown } },
    ) => {
      state.widgetConfigs[action.payload.id] = action.payload.config;
    },
    setChildPayload: (state, action: { payload: Record<string, unknown> }) => {
      state.childPayload = action.payload;
    },
  },
});

export const {
  setProgramId,
  setProjectId,
  setIsPreview,
  setIsPublished,
  setWidgetConfig,
  setChildPayload,
} = chartSlice.actions;

export default chartSlice.reducer;
