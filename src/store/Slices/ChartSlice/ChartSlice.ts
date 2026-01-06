import { createSlice } from "@reduxjs/toolkit";

interface ChartBuilderState{
    programId:string;
    projectId:string;
}

const initialState:ChartBuilderState={
 programId:'',
 projectId:''   
}

const chartSlice = createSlice({
    name:"chartBuilder",
    initialState,
    reducers:{
        setProgramId:(state,action)=>{
            state.programId=action.payload;
        },
        setProjectId:(state,action)=>{
            state.projectId=action.payload;
        }
    }
})

export const {setProgramId,setProjectId}=chartSlice.actions;
export default chartSlice.reducer;