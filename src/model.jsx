import { GoogleGenerativeAI } from '@google/generative-ai';
import cps from './App.jsx'
// const apiKey = REACT_APP_GEMINI_API_KEY; // 直接替換為你的API金鑰
const apiKey = 'AIzaSyBjPvvUrPP3X4mnDCvseg8dUfZvd2IjMHc';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const generateContent = async (prompt) => {
    console.log('e')
      const result = await model.generateContent([prompt,'請問全世界的平均CPS是多少。我的cps是'+{cps}+'，你覺得怎麼樣?請給我一些建議'])
      return result
  };
  