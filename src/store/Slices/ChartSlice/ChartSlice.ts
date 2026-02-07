import { createSlice } from "@reduxjs/toolkit";

interface ChartBuilderState {
  programId: string;
  projectId: string;
  isPreview: boolean;
  isPublished: boolean;
  widgetConfigs: Record<string, unknown>;
}

const initialState: ChartBuilderState = {
  programId: "",
  projectId: "",
  isPreview: false,
  isPublished: false,
  widgetConfigs: {},
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
  },
});

export const {
  setProgramId,
  setProjectId,
  setIsPreview,
  setIsPublished,
  setWidgetConfig,
} = chartSlice.actions;

export default chartSlice.reducer;
