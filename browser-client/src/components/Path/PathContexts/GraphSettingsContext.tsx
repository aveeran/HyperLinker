import React, { createContext, ReactNode } from "react";
import { Article } from "../../../utils/utils";

export interface GraphSettingsContextType {
    rowLength: number;
    isDirected: boolean;
    isPath: boolean;
    path: Article[];
    freePath: Article[];
    handleMouseEnterNode: ((nodeIndex: number) => void) | null;
    handleMouseLeaveNode: (() => void) | null;
    handleClickNode: (nodeIndex: number) => void;
    handleMouseEnterEdge: ((nodeIndex: number) => void) | null;
    handleMouseLeaveEdge: (() => void) | null;
    handleClickEdge: (nodeIndex: number) => void;
}

export const GraphSettingsContext = createContext<GraphSettingsContextType | null>(null);

interface GraphSettingsProviderProps {
    value: GraphSettingsContextType;
    children: ReactNode;
}

export function GraphSettingsProvider({ value, children }: GraphSettingsProviderProps) {
    return (
        <GraphSettingsContext.Provider value={value}>
            {children}
        </GraphSettingsContext.Provider>
    );
}
