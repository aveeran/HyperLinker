import React, { createContext, ReactNode } from "react";
import { Article, GameStatusInterface, NodeHistoryInterface } from "../../../utils/utils";

export interface NodeInteractionContextType {
    activeNode: number | null;
    hoveredNode: number | null;
    nodeHistory: NodeHistoryInterface[];
    visitedPath: Article[];
    currentNode: number;
    gameStatus: GameStatusInterface
}

export const NodeInteractionContext = createContext<NodeInteractionContextType | null>(null);

interface NodeInteractionProviderProps {
    value: NodeInteractionContextType;
    children: ReactNode;
}

export function NodeInteractionProvider({ value, children }: NodeInteractionProviderProps) {
    return (
        <NodeInteractionContext.Provider value={value}>
            {children}
        </NodeInteractionContext.Provider>
    );
}
