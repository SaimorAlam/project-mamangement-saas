import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DropdownSelect = ({
  placeholderText,
  dropdownItem,
  onChange,
  label,
}: {
  placeholderText: string;
  dropdownItem: { value: string; title: string }[] | string[];
  onChange: (e: string) => void;
  label?: string;
}) => {
  return (
    <div className="">
      <Select onValueChange={onChange}>
        <label className="text-sm text-[#475569]">{label}</label>
        <SelectTrigger className="w-full border border-[#CBD5E1] text-[#475569] mt-1">
          <SelectValue placeholder={placeholderText} />
        </SelectTrigger>
        <SelectContent className="border border-[#CBD5E1] bg-white ">
          {dropdownItem.map((item, index) => {
            const value =
              typeof item === "string" ? item : item.value;
            const title =
              typeof item === "string" ? item : item.title;
            return (
              <SelectItem
                key={index}
                className="hover:bg-[#F5F8FA] hover:text-[#475569]"
                value={value}
              >
                {title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownSelect;
