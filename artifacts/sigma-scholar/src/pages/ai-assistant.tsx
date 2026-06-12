import { ProtectedRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Bot, User as UserIcon, Send, Sparkles, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getChatHistory, saveChatMessage } from "@/lib/firestore";
import { generateAIResponse } from "@/lib/ai";
import { ChatMessage } from "@workspace/api-client-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyMissing, setKeyMissing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      getChatHistory(user.uid).then(history => {
        if (history.length === 0) {
          setMessages([{
            id: 'welcome',
            userId: user.uid,
            role: 'assistant',
            content: `Hi **${user.displayName?.split(" ")[0] || "there"}**! 👋 I'm your **Sigma AI Tutor**, powered by Gemini.\n\nI can help you with:\n- 📐 Explain any CBSE concept (Classes 6–12)\n- 🔬 Solve Math, Science, or any subject problems\n- 📝 Create practice questions for revision\n- 💡 Simplify complex topics with examples\n\nWhat would you like to learn today?`,
            createdAt: new Date().toISOString()
          }]);
        } else {
          setMessages(history);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const userMsg = input.trim();
    setInput("");

    const userPayload = { userId: user.uid, role: 'user' as const, content: userMsg };
    setMessages(prev => [...prev, { id: Date.now().toString(), ...userPayload, createdAt: new Date().toISOString() }]);
    setLoading(true);

    try {
      await saveChatMessage(userPayload);
      const responseText = await generateAIResponse(
        `You are Sigma AI Tutor, a CBSE educational assistant for Classes 6-12. Answer clearly, using markdown formatting with bold, bullet points, and code blocks where appropriate. Be helpful, concise, and educational.\n\nStudent asks: ${userMsg}`,
        messages.filter(m => m.id !== 'welcome')
      );
      const assistantPayload = { userId: user.uid, role: 'assistant' as const, content: responseText };
      const savedMsg = await saveChatMessage(assistantPayload);
      setMessages(prev => [...prev, savedMsg]);
    } catch (e: any) {
      if (e.message === "AI_KEY_MISSING") {
        setKeyMissing(true);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          userId: user.uid,
          role: 'assistant',
          content: "⚠️ **Gemini API Key Not Configured**\n\nTo use the AI assistant, please add your `VITE_GEMINI_API_KEY` to the environment secrets.\n\nGet a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).",
          createdAt: new Date().toISOString()
        }]);
      } else {
        toast.error("Failed to get AI response");
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          userId: user.uid,
          role: 'assistant',
          content: "I encountered an error. Please try again.",
          createdAt: new Date().toISOString()
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTED = [
    "Explain Newton's Laws of Motion",
    "What are the types of triangles?",
    "Describe the water cycle",
    "Help me with Quadratic Equations",
    "What is photosynthesis?",
    "Explain the French Revolution",
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex-1 flex flex-col h-[calc(100dvh-4rem)] md:p-6 bg-muted/10">
          <Card className="flex-1 flex flex-col border-border/60 shadow-lg overflow-hidden max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-card flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Sigma AI Tutor</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400" /> Powered by Google Gemini
                  </p>
                </div>
              </div>
              {keyMissing && (
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" /> API Key Missing
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-background/50" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={msg.id || i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    {msg.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-card border border-border shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              )}

              {/* Suggested prompts (only when few messages) */}
              {messages.length <= 1 && !loading && (
                <div className="pt-4">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map(s => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); }}
                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/60 hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t border-border shrink-0">
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="flex gap-2 max-w-4xl mx-auto"
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={keyMissing ? "Add VITE_GEMINI_API_KEY to enable AI..." : "Ask anything about your CBSE syllabus..."}
                  className="flex-1 h-12 rounded-xl border-border/80 shadow-sm text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-12 px-5 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
