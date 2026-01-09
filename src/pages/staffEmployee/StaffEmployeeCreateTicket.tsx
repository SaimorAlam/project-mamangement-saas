import BoxContainer from "@/common/BoxContainer";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import DescriptionTextArea from "@/common/DescriptionTextArea";
import { Send } from "lucide-react";

const StaffEmployeeCreateTicket = () => {
  const selectItem = [
    { value: "light", title: "Light" },
    { value: "dark", title: "Dark" },
    { value: "system", title: "System" },
  ];

  const handleAttachment = () => {};
  const handleEmoji = () => {};
  const handleMessage = () => {};

  return (
    <div className="w-1/3 mx-auto">
      <BoxContainer>
        <div className="space-y-6">
          <h4>Create Support Tickets</h4>
          <BoxContainer>
            <div className="space-y-6">
              <DropdownSelect
                placeholderText={"Write a message"}
                dropdownItem={selectItem}
                onChange={handleMessage}
              />

              <DescriptionTextArea
                handleAttachment={handleAttachment}
                handleEmoji={handleEmoji}
              />
              <div className="flex justify-end">
                <PrimaryButton
                  type={"Primary"}
                  title={"Send"}
                  rightIcon={<Send />}
                />
              </div>
            </div>
          </BoxContainer>
        </div>
      </BoxContainer>
    </div>
  );
};

export default StaffEmployeeCreateTicket;
