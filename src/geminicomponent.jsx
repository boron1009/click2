import React, { useState, useEffect } from 'react';
import { generateContent } from './model'; // 替換為實際的Model文件路徑

const GeminiComponent = () => {
  const [response, setResponse] = useState(null);

  const defaultPrompt = '你是一個專業分析師，請你以專業的角度回答我的問題'; // 替換為實際的預設prompt

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await generateContent(defaultPrompt);
      console.log(typeof(defaultPrompt))
      setResponse(apiResponse);
      console.log(typeof(defaultPrompt))
    };

    fetchData();
  }, []);

  return (
    <div>
      {response ? (
          <pre>`${response}`</pre>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GeminiComponent;
