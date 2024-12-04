import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  subText?: string;
}

export default function TypewriterText({ text, subText }: TypewriterTextProps) {
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

  return (
    <div className="font-sans">
      <h2 className="text-2xl font-semibold mb-2 text-white">{displayText}</h2>
      {subText && <p className="text-lg text-white/90">{displaySubText}</p>}
    </div>
  );
}