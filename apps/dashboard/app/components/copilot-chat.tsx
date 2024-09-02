import React, { useState } from "react";
import { useChat } from "ai/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/components/sheet";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { Bot, Send } from "lucide-react";

interface CopilotChatProps {
  serviceName: string;
}

export function CopilotChat({ serviceName }: CopilotChatProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `/api/chat/${serviceName}`,
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your AI assistant for analyzing telemetry data of the ${serviceName}. What would you like to know about this service's performance or errors?`,
        },
      ],
    });

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bot size={16} />
          Copilot
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[95vw] sm:w-[600px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6">
            <SheetTitle>Copilot Assistant for {serviceName}</SheetTitle>
          </SheetHeader>
          <div className="flex-grow px-6 overflow-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-700 text-zinc-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-zinc-500">AI is thinking...</div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Ask about ${serviceName} telemetry...`}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2" disabled={isLoading}>
                <Send size={16} />
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
