/* eslint-disable @typescript-eslint/no-explicit-any */
import BoxContainer from "@/common/BoxContainer";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import DescriptionTextArea from "@/common/DescriptionTextArea";
import { Send } from "lucide-react";
import { useCreateSupportMutation } from "@/store/Api/AdminApi/ClientSupportApi";
import { toast } from "sonner";

const ClientCreateTicket = () => {
  const [createSupport] = useCreateSupportMutation();
  const selectItem = [
    { value: "light", title: "Light" },
    { value: "dark", title: "Dark" },
    { value: "system", title: "System" },
  ];

  const handleAttachment = (data: any) => {
    console.log(data);
  };
  const handleEmoji = (data: any) => {
    console.log(data);
  };
  const handleMessage = (data: any) => {
    console.log(data);
  };

  const handleSubmit = async () => {
    try {
      const response = await createSupport({}).unwrap();
      console.log(response);
      toast.success("Support ticket created successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };

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
                  onClick={() => handleSubmit()}
                />
              </div>
            </div>
          </BoxContainer>
        </div>
      </BoxContainer>
    </div>
  );
};

export default ClientCreateTicket;
