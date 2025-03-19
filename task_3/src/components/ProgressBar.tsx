// import React from 'react';
// import { Check } from 'lucide-react';
// import { useLocation } from 'react-router-dom';

// const steps = [
//   { path: '/upload', label: 'Upload' },
//   { path: '/recipients', label: 'Recipients' },
//   { path: '/editor', label: 'Editor' },
//   { path: '/summary', label: 'Summary' },
// ];

// export const ProgressBar: React.FC = () => {
//   const location = useLocation();
//   const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);

//   return (
//     <div className="w-full max-w-3xl mx-auto mb-8">
//       <div className="flex justify-between">
//         {steps.map((step, index) => (
//           <div
//             key={step.path}
//             className="flex flex-col items-center relative flex-1"
//           >
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                 index <= currentStepIndex
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 text-gray-500'
//               }`}
//             >
//               {index < currentStepIndex ? (
//                 <Check className="w-5 h-5" />
//               ) : (
//                 index + 1
//               )}
//             </div>
//             <div className="text-sm mt-2">{step.label}</div>
//             {index < steps.length - 1 && (
//               <div
//                 className={`absolute top-4 -right-1/2 h-0.5 w-full ${
//                   index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
//                 }`}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const steps = [
  { path: '/upload', label: 'Upload' },
  { path: '/recipients', label: 'Recipients' },
  { path: '/editor', label: 'Editor' },
  { path: '/summary', label: 'Summary' },
];

export const ProgressBar: React.FC = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center relative">
        {steps.map((step, index) => (
          <div key={step.path} className="flex-1 flex items-center">
            {/* Line before the step (not for the first step) */}
            {index > 0 && (
              <div
                className={`h-0.5 flex-1 ${
                  index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}

            {/* Step Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm z-10
                ${index <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}
              `}
            >
              {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
            </div>

            {/* Line after the step (not for the last step) */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels Below */}
      <div className="flex justify-between text-sm mt-2">
        {steps.map((step) => (
          <div key={step.path} className="text-center flex-1">
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};
