import { Outlet } from "react-router-dom";

const ViewerPanelOverview = () => {
  return (
    <div>
      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
};
export default ViewerPanelOverview;
