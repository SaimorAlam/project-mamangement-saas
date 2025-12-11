import { Navigate, NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

const EmailCode = () => {
  const { type } = useLocation().state;
  console.log(type);
  if (!type) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img src="Logo.png" alt="Logo" />
        <img className="w-full" src="login image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-14 font-semibold text-center">
          Enter the {type} code
        </h2>
        <form className="mt-4 ">
          <div className="mb-4">
            <ul className="flex justify-center items-center gap-4 mt-[48px] ">
              <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center">
                <span className="text-[48px] font-medium text-[#64748B] text-center">
                  -
                </span>
              </li>
              <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center">
                <span className="text-[48px] font-medium text-[#64748B] text-center">
                  -
                </span>
              </li>
              <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center">
                <span className="text-[48px] font-medium text-[#64748B] text-center">
                  -
                </span>
              </li>
              <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center">
                <span className="text-[48px] font-medium text-[#64748B] text-center">
                  -
                </span>
              </li>
            </ul>
            <p className="text-[#475569] text-center mt-4 mb-10">
              Didn’t get the code? Send again in{" "}
              <span className="text-[#1C73E0 ]">02.05s</span>
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <NavLink
              to="/login"
              className="w-[70%] cursor-pointer bg-blue-500 text-center text-white p-2 rounded-md hover:bg-blue-600"
              onClick={() =>
                toast.success("Your Password Has been rested Successfully")
              }
            >
              <button type="submit">Confirm</button>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailCode;
