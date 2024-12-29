import React, { createContext, ReactNode } from "react";
import { Article } from "../../../utils/utils";

export interface EdgeInteractionContextType {
    activeEdge: number | null;
    hoveredEdge: number | null;
    edgeHistory: Article[][] | null;
    visitedPath: Article[];
}

export const EdgeInteractionContext = createContext<EdgeInteractionContextType | null>(null);

interface EdgeInteractionProviderProps {
    value: EdgeInteractionContextType;
    children: ReactNode;
}

export function EdgeInteractionProvider({ value, children }: EdgeInteractionProviderProps) {
    return (
        <EdgeInteractionContext.Provider value={value}>
            {children}
        </EdgeInteractionContext.Provider>
    );
}
