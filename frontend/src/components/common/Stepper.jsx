import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ steps, currentStep }) => {
  const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="stepper-container">
      <div className="stepper-line">
        <div 
          className="stepper-line-fill" 
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }} 
        />
      </div>

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div 
            key={index} 
            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {isCompleted ? <Check size={18} strokeWidth={2.5} /> : index + 1}
            </div>
            <div className="step-label">{step.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
