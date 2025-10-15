import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { chatOptions, type ChatType } from "@/store/chat";

interface ChatHeaderProps {
  chatType: ChatType;
  onChatTypeChange: (type: ChatType) => void;
  onNewChat: () => void;
}

export function ChatHeader({
  chatType,
  onChatTypeChange,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col justify-center gap-1 px-2 h-14 sticky top-10 z-5">
      <div className="flex w-full justify-between items-center">
        <Button size="sm" onClick={onNewChat}>
          New Chat
        </Button>
        <Select
          value={chatType}
          onValueChange={(v) => onChatTypeChange(v as ChatType)}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {chatOptions.map((value) => (
              <SelectItem key={value} value={value as ChatType}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
