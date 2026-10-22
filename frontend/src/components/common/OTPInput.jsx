import React, { useRef, useEffect } from 'react';

export const OTPInput = ({ value = '', onChange, length = 6, disabled = false, error = false }) => {
  const inputRefs = useRef([]);

  // Ensure digits array matches length
  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  useEffect(() => {
    // Focus first empty box initially
    if (!disabled && inputRefs.current[0]) {
      const firstEmptyIndex = digits.findIndex(d => !d);
      const targetIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
      inputRefs.current[targetIndex]?.focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    const char = val.slice(-1); // Take last entered character

    if (char && !/^\d+$/.test(char)) return; // Only accept digits

    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    // Auto move to next input if digit entered
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current is empty, focus previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const pasteDigits = pastedData.replace(/\D/g, '').slice(0, length);
    if (pasteDigits) {
      onChange(pasteDigits);
      const nextIndex = Math.min(pasteDigits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        margin: 'var(--space-md) 0'
      }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}-digit verification code`}
          style={{
            width: '46px',
            height: '52px',
            textAlign: 'center',
            fontSize: '1.35rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            border: `2px solid ${error ? 'var(--color-status-danger)' : digits[index] ? 'var(--color-forest-green)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-white)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-forest-green)';
            e.target.style.boxShadow = '0 0 0 3px rgba(23, 63, 42, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-status-danger)' : digits[index] ? 'var(--color-forest-green)' : 'var(--color-border)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
