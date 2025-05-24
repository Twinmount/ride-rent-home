"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { StateType } from "@/types";

type Props = {
  data: StateType[];
  isLoading: boolean;
  onClick: (e: string) => void;
};

export function SearchResults({ data = [], onClick, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="px-4 py-1 text-left text-sm font-normal text-slate-700">
        <span>Loading...</span>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="px-4 py-4 text-left text-sm font-normal text-slate-700">
        <span>No result found</span>
      </div>
    );
  }

  return (
    <ScrollArea className="-mt-3 flex h-fit max-h-full flex-col space-y-3 pt-4">
      <h2 className="mb-3 px-4 text-sm font-bold">SEARCH RESULTS</h2>
      <ul className="flex flex-col space-y-1 pb-2">
        {data?.map((state: StateType) => {
          return (
            <li
              key={state?.stateId}
              className="cursor-pointer px-4 py-1 text-left text-sm font-normal text-slate-700 hover:bg-slate-100"
              onClick={() => onClick(state?.stateValue)}
            >
              <span>{state?.stateName}</span>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
