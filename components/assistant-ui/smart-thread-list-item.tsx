import type { FC } from "react";
import {
  ThreadListItemPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, Loader2, RefreshCw } from "lucide-react";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useAutoTitleGeneration } from "@/hooks/use-auto-title-generation";

/**
 * 智能 ThreadListItem 組件
 * 
 * 功能：
 * 1. 自動生成有意義的對話標題
 * 2. 手動刷新標題功能
 * 3. 生成狀態的視覺反饋
 */
export const SmartThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="data-[active]:bg-muted hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2">
      <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2 text-start">
        <SmartThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemActions />
    </ThreadListItemPrimitive.Root>
  );
};

const SmartThreadListItemTitle: FC = () => {
  const { hasGenerated, generatedTitle, isGenerating } = useAutoTitleGeneration();

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm flex-grow">
        {/* 優先顯示生成的標題，否則使用預設標題 */}
        {generatedTitle || <ThreadListItemPrimitive.Title fallback="新對話" />}
      </p>
      {/* 顯示生成狀態指示器 */}
      {isGenerating && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};

const ThreadListItemActions: FC = () => {
  const { generateTitle, isGenerating } = useAutoTitleGeneration();

  return (
    <div className="flex items-center gap-1 mr-2">
      {/* 手動刷新標題按鈕 */}
      <TooltipIconButton
        className="hover:text-primary text-muted-foreground size-4 p-0"
        variant="ghost"
        tooltip="重新生成標題"
        disabled={isGenerating}
        onClick={(e) => {
          e.stopPropagation();
          generateTitle().catch(console.error);
        }}
      >
        <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
      </TooltipIconButton>
      
      {/* 歸檔按鈕 */}
      <ThreadListItemPrimitive.Archive asChild>
        <TooltipIconButton
          className="hover:text-primary text-muted-foreground size-4 p-0"
          variant="ghost"
          tooltip="歸檔對話"
        >
          <ArchiveIcon className="h-3 w-3" />
        </TooltipIconButton>
      </ThreadListItemPrimitive.Archive>
    </div>
  );
};