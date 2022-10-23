import React from 'react';

export default function CalculatorKey({ onPress, className, ...props }) {
  console.log(className);
  return <button className={`calculator-key ${className}`} {...props} onClick={onPress} />;
}
