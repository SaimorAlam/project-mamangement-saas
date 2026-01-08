import { useAppSelector } from "@/hooks/useRedux";
import { useLazyGetProjectTreeQuery } from "@/store/Api/NodeApi/NodeApi";
import { useMemo, useEffect, useState } from "react";


const useChartData = ({newData}: {newData?: any}) => {
    const [childTiers, setChildTiers] = useState<any[]>([]);
    const {projectId} = useAppSelector((state) => state.chartSlice)
      const [getProjectTree,{data:childNodes}] = useLazyGetProjectTreeQuery()
      useEffect(()=>{
        if(!newData || newData.length === 0){
            getProjectTree(projectId)
        }
      },[projectId, newData])

    const projectTreeData = useMemo(() => childNodes?.data?.map((item: any) => ({
    id: item.id,
    name: item.taskName,
    children: item.children,
  })) || [], [childNodes])

       useEffect(()=>{
        if(newData && newData?.length >= 0){
            setChildTiers(newData)
        }else {
            setChildTiers(projectTreeData)
        }
  },[childNodes, newData, projectTreeData])

    return {
        childTiers
    }
};

export default useChartData;
