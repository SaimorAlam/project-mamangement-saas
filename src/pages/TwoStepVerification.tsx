import React from 'react'
import { MessageSquareText, Mail  } from 'lucide-react';

const TwoStepVerification = () => {
  return (
    <div className='flex items-center justify-center min-h-screen mt-[-250px] gap-[100px]'>
        <div className='w-[28%]'>
            <h3 className='text-[48px] font-semibold mb-[10px]'>2-Step Verification</h3>
            <p className='text-4 text-[#475569]'>To help keep your account safe, Theta Analyzer wants to make sure it’s really you trying to log in</p>
        </div>
        <div>
            <h4 className='text-[18px] font-medium'>Choose your log in process:</h4>
            <div className='flex items-start mt-8 pb-4 gap-[12px] border-b-1 border-b-[#94A3B8]'>
                <MessageSquareText/>
                <div>
                    <h5>Get verification code at ****-****47</h5>
                    <p className='text-[#475569]'>Write additional text here.</p>
                </div>
            </div>
            <div className='flex items-start gap-[12px] mt-4'>
                <Mail />
                <div>
                    <h5>Get verification code at ****-****47</h5>
                    <p className='text-[#475569]'>Write additional text here.</p>
                </div>
            </div>
        </div> 
    </div>
  )
}

export default TwoStepVerification