import { GoogleGenerativeAI } from "@google/generative-ai";

export const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

export const generateAIResponse = async (prompt: string, history: any[] = []) => {
  const genAI = getAI();
  if (!genAI) throw new Error("AI_KEY_MISSING");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  const chat = model.startChat({ history: formattedHistory });
  const result = await chat.sendMessage(prompt);
  return result.response.text();
};

export const generateStudyNotes = async (
  topicName: string,
  chapterName: string,
  subjectName: string,
  className: string
): Promise<string> => {
  const genAI = getAI();
  if (!genAI) throw new Error("AI_KEY_MISSING");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are an expert CBSE teacher for ${className} ${subjectName}. 
Create comprehensive study notes for: "${topicName}" from Chapter: "${chapterName}"

Format as structured markdown:

# 📚 ${topicName}
## 🎯 Learning Objectives
(3-4 bullet points of what students will learn)

## ⭐ VIP Formulas & Key Points
> **KEY FORMULA/CONCEPT 1:** [formula or key point]
> **KEY FORMULA/CONCEPT 2:** [formula or key point]
> (Use blockquotes for ALL important formulas and definitions)

## 📖 Detailed Explanation
(Well-structured explanation with subheadings, bullet points, diagrams described in text)

## 🔬 Worked Examples
### Example 1:
**Problem:** [problem statement]
**Solution:** [step-by-step solution]

### Example 2:
**Problem:** [problem statement]
**Solution:** [step-by-step solution]

## 🧠 Important Definitions
| Term | Definition |
|------|-----------|
| Term 1 | Clear definition |
| Term 2 | Clear definition |

## 💡 Memory Tricks & Mnemonics
(Easy ways to remember key concepts)

## 📝 Quick Revision Summary
- Point 1
- Point 2
- Point 3
(5-7 most important points)

Make it comprehensive, accurate for CBSE board exams, engaging, and student-friendly.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateCheatSheet = async (
  topicName: string,
  chapterName: string,
  subjectName: string,
  className: string
): Promise<string> => {
  const genAI = getAI();
  if (!genAI) throw new Error("AI_KEY_MISSING");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Create a compact 1-2 page formula cheat sheet for CBSE ${className} ${subjectName}.
Topic: "${topicName}" | Chapter: "${chapterName}"

Format as markdown:

# ⚡ CHEAT SHEET: ${topicName}

## 🏆 VIP FORMULAS (Must Remember for Exam!)
> **Formula 1:** [formula with explanation]
> **Formula 2:** [formula with explanation]
(All important formulas in blockquotes)

## 📌 Key Definitions at a Glance
| Term | One-Line Definition |
|------|-------------------|
| Term | Definition |

## ⚡ Quick Facts & Figures
- [Important fact 1]
- [Important fact 2]

## ⚠️ Common Mistakes to Avoid
- [Mistake 1 and how to avoid it]
- [Mistake 2 and how to avoid it]

## 🎯 Exam Weightage & Tips
- [Which parts are most important for exams]
- [Specific exam tips]

Keep it ultra-concise, exam-focused. Perfect for last-minute revision.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export interface TestQuestion {
  type: 'mcq' | 'assertion-reason' | 'true-false' | 'very-short' | 'short' | 'long' | 'case-based';
  question: string;
  options?: string[];
  correct?: string | boolean;
  modelAnswer?: string;
  marks: number;
  passage?: string;
  subQuestions?: Array<{ question: string; answer: string; marks: number }>;
}

export const generateTestQuestions = async (
  topicName: string,
  chapterName: string,
  subjectName: string,
  className: string
): Promise<TestQuestion[]> => {
  const genAI = getAI();
  if (!genAI) throw new Error("AI_KEY_MISSING");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create a 40-question CBSE-standard assessment for ${className} ${subjectName}.
Topic: "${topicName}" | Chapter: "${chapterName}"

Return ONLY a valid JSON array (NO markdown, NO code fences, NO extra text - just raw JSON):
[
  {"type":"mcq","question":"Q?","options":["A) option1","B) option2","C) option3","D) option4"],"correct":"A) option1","marks":1},
  ... 10 MCQs total ...
  {"type":"assertion-reason","question":"Assertion (A): statement\\nReason (R): statement","options":["A) Both A and R are true and R is the correct explanation of A","B) Both A and R are true but R is not the correct explanation of A","C) A is true but R is false","D) A is false but R is true"],"correct":"A) Both A and R are true and R is the correct explanation of A","marks":1},
  ... 5 Assertion-Reason total ...
  {"type":"true-false","question":"statement","correct":true,"modelAnswer":"True/False because explanation","marks":1},
  ... 5 True/False total ...
  {"type":"very-short","question":"Q?","modelAnswer":"brief answer","marks":1},
  ... 5 Very Short total ...
  {"type":"short","question":"Q?","modelAnswer":"30-50 word model answer","marks":3},
  ... 5 Short Answer total ...
  {"type":"long","question":"Q?","modelAnswer":"80-120 word detailed model answer with key points:\\n1. Point one\\n2. Point two\\n3. Point three","marks":5},
  ... 5 Long Answer total ...
  {"type":"case-based","passage":"Reading passage of 3-4 sentences related to topic","subQuestions":[{"question":"Sub-question 1?","answer":"Answer 1","marks":1},{"question":"Sub-question 2?","answer":"Answer 2","marks":1},{"question":"Sub-question 3?","answer":"Answer 3","marks":1},{"question":"Sub-question 4?","answer":"Answer 4","marks":1}],"marks":4},
  ... 5 Case-Based total ...
]

STRICT REQUIREMENTS:
- Exactly 10 MCQs (1 mark each) = 10 marks
- Exactly 5 Assertion-Reason (1 mark each) = 5 marks  
- Exactly 5 True/False (1 mark each) = 5 marks
- Exactly 5 Very Short (1 mark each) = 5 marks
- Exactly 5 Short Answer (3 marks each) = 15 marks
- Exactly 5 Long Answer (5 marks each) = 25 marks
- Exactly 5 Case-Based (4 marks each with 4 sub-questions of 1 mark each) = 20 marks
- Total: 40 questions
- All questions MUST be about "${topicName}" from "${chapterName}"
- Questions must be CBSE board exam standard and educationally accurate
- Return ONLY valid JSON array, nothing else`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  // Clean markdown code blocks
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse test questions from AI response");
  }
};
