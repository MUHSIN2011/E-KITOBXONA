import { useState } from "react";
import { Bot, Loader2, Brain, Info } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLazyGetAiTransferExplanationQuery, useGetAiSupplyExplanationQuery } from "@/api/api";

interface AiHelperProps {
  id: number;
  type: 'transfer' | 'supply';
}

export function AiHelperProps({ id, type }: AiHelperProps) {

  const [getTransfer, transferResult] = useLazyGetAiTransferExplanationQuery();
  const supplyResult = useGetAiSupplyExplanationQuery(id, {
    skip: !id
  });


  const result = type === 'transfer' ? transferResult : supplyResult;
  const trigger = type === 'transfer' ? getTransfer : () => supplyResult.refetch();

  const getErrorMessage = (error: any) => {
    const errorStr = JSON.stringify(error).toLowerCase();
    if (errorStr.includes('quota') || errorStr.includes('429')) {
      return "Лимити истифодаи AI барои имрӯз ба охир расид.";
    }
    if (errorStr.includes('502') || errorStr.includes('503')) {
      return "Сервер муваққатан кор намекунад. Баъдтар кӯшиш кунед.";
    }
    return error?.data?.detail || "Хатогии номаълум";
  };


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => trigger(id)}
          className="text-blue-600 cursor-pointer hover:text-blue-700 hover:bg-blue-100"
        >
          <Bot className="w-4 h-4" />
          Help
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 sm:w-[400px] p-0 overflow-hidden shadow-2xl border-purple-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {result.isFetching ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : result.error ? (
          <div className="flex flex-col max-h-[450px]">
            <div className="flex items-center gap-2 border-b p-4 bg-red-50/50 shrink-0">
              <Info className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-slate-800">Хатогӣ</h4>
            </div>

            <div className="p-4">
              <p className="text-sm text-red-700 mb-2">
                Хизмати AI дастрас нест.
              </p>
              {getErrorMessage(result.error)}
            </div>
          </div>
        ) : result.data ? (
          <div className="flex flex-col max-h-[450px]">
            <div className="flex items-center gap-2 border-b p-4 bg-purple-50/50 shrink-0">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-slate-800">Ёрдамчии AI</h4>
            </div>

            <div
              className="overflow-y-auto p-4 flex-1 custom-scrollbar"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1 text-gray-800 dark:text-gray-200">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                  }}
                >
                  {result.data.answer.replace(/\\n/g, '\n').replace(/^(\d+)\.(?!\s)/gm, '$1. ')}
                </ReactMarkdown>
              </div>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-gray-900 rounded-lg flex gap-2 items-start border border-slate-100 dark:border-gray-700">
                <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                <p className="text-[10px] text-slate-400 uppercase italic">
                  {result.data.disclaimer}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}