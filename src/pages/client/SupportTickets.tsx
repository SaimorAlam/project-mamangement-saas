import BoxContainer from "@/common/BoxContainer";
import PrimaryButton from "@/common/PrimaryButton";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SupportTickets = () => {
  const navigate = useNavigate();
  return (
    <BoxContainer>
      <div className="flex items-center justify-between">
        <h4 className="">Support Tickets</h4>
        <div className="">
          <PrimaryButton
            onClick={() => navigate("create-tickets")}
            type={"Primary"}
            leftIcon={<Plus />}
            title={"Create Ticket"}
          />
        </div>
      </div>
    </BoxContainer>
  );
};

export default SupportTickets;
