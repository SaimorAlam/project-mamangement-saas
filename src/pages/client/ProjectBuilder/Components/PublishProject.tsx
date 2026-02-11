import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setIsPublished } from "@/store/Slices/ChartSlice/ChartSlice";
import { useEffect } from "react";
import ProjectDashboardView from "./ProjectDashboardView";

const PublishProject = () => {
  const dispatch = useAppDispatch();
  const { projectId, selectedWidgets } = useAppSelector(
    (state) => state.chartSlice,
  );

  useEffect(() => {
    dispatch(setIsPublished(true));
    return () => {
      dispatch(setIsPublished(false));
    };
  }, [dispatch]);

  return (
    <div className="p-6">
      <ProjectDashboardView
        projectId={projectId as string}
        isPreviewOrPublished={true}
        selectedWidgets={selectedWidgets}
        activeWidget=""
        hiddenDefaultWidgets={[]}
        handleDefaultDelete={() => {}}
        handleDefaultCopy={() => {}}
        handleWidgetDelete={() => {}}
      />
    </div>
  );
};

export default PublishProject;
