import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { FC, PropsWithChildren } from "react";

import { Thread } from "@/components/assistant-ui/thread";

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={70} minSize={30}>
        {children}
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={20}>
        <Thread />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
