"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

import { useState } from "react";

export type ApprovalArgs = {
  message: string;
};

export type ApprovalResult = {
  approved: boolean;
  timestamp: string;
};

const ApprovalComponent = ({ args, result, addResult }: {
  args: ApprovalArgs,
  result?: ApprovalResult,
  addResult: (result: ApprovalResult) => void
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (result) {
    return (
      <Card className={`${result.approved ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} max-w-md`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {result.approved ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <CardTitle className={`text-sm ${result.approved ? 'text-green-800' : 'text-red-800'}`}>
              {result.approved ? '✅ 已批准' : '❌ 已拒絕'}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {result.timestamp && `時間：${new Date(result.timestamp).toLocaleString('zh-TW')}`}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    addResult({
      approved: true,
      timestamp: new Date().toISOString(),
    });
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    addResult({
      approved: false,
      timestamp: new Date().toISOString(),
    });
    setIsProcessing(false);
  };

  return (
    <Card className="border-amber-200 bg-amber-50 max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800 text-base">需要確認</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-700">
          {args.message}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {isProcessing ? "處理中..." : "✓ 確認"}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isProcessing}
            variant="destructive"
            className="flex-1"
            size="sm"
          >
            {isProcessing ? "處理中..." : "✗ 取消"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ApprovalToolUI = makeAssistantToolUI<ApprovalArgs, ApprovalResult>({
  toolName: "requestApproval",
  render: ApprovalComponent,
});