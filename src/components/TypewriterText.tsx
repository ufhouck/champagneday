import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  subText?: string;
  variant?: 'light' | 'dark';
}

export default function TypewriterText({ text, subText, variant = 'light' }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [displaySubText, setDisplaySubText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else if (subText && index < text.length + subText.length) {
        setDisplaySubText(subText.slice(0, index - text.length + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [text, subText]);

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-800';
  const subTextColor = variant === 'light' ? 'text-white/90' : 'text-gray-600';

  return (
    <div className="font-sans">
      <h2 className={`text-2xl font-semibold mb-2 ${textColor}`}>{displayText}</h2>
      {subText && <p className={`text-lg ${subTextColor}`}>{displaySubText}</p>}
    </div>
  );
}