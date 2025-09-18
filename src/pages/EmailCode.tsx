import React from "react"

const EmailCode = () => {

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img className="w-full" src="login image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-[56px] font-semibold text-center">Enter the email code</h2>
        <form className="mt-4 ">
          <div className="mb-4">
            <ul className="flex justify-center items-center gap-4 mt-[48px]">
                <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center"><span className="text-[48px] font-medium text-[#64748B] text-center">-</span></li>
                <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center"><span className="text-[48px] font-medium text-[#64748B] text-center">-</span></li>
                <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center"><span className="text-[48px] font-medium text-[#64748B] text-center">-</span></li>   
                <li className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center"><span className="text-[48px] font-medium text-[#64748B] text-center">-</span></li>
            </ul>
            <p className="text-[#475569] text-center mt-4 mb-10">Didn’t get the code? Send again in <span className="text-[#1C73E0 ]">02.05s</span></p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
            type="submit"
            className="w-[70%] cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmailCode