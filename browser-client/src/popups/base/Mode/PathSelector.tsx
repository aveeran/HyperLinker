import React from "react";
import { EdgeInteractionContextType, EdgeInteractionProvider } from "../../../components/Path/PathContexts/EdgeInteractionContext";
import { GraphSettingsContext, GraphSettingsContextType, GraphSettingsProvider } from "../../../components/Path/PathContexts/GraphSettingsContext";
import { NodeInteractionContextType, NodeInteractionProvider } from "../../../components/Path/PathContexts/NodeInteractionContext";
import { Article } from "../../../utils/utils";
import PathRow from "../../../components/Path/PathRow";
import PathVerticalEdge from "../../../components/Path/PathVerticalEdge";

interface PathSelectorProps {
    currIdx: number,
    path: Article[],
    handleClickNode: (nodeIndex: number) => void,
    rowLength: number
}

function PathSelector({ currIdx, path, handleClickNode, rowLength } : PathSelectorProps) {
    const rows = path.reduce<Array<Array<Article>>>((acc, step, index) => {
        const rowIndex = Math.floor(index / rowLength);
        if (!acc[rowIndex]) acc[rowIndex] = [];
        acc[rowIndex].push(step);
        return acc;
      }, []);
  
      rows.forEach((row, index) => {
        if (index % 2 === 1) row.reverse();
      });
  
      const graphSettingsValue: GraphSettingsContextType = {
        rowLength: 3,
        isDirected: true,
        isPath: true,
        path: path,
        freePath: [],
        handleMouseEnterNode: null,
        handleMouseLeaveNode: null,
        handleClickNode: handleClickNode,
        handleMouseEnterEdge: null,
        handleMouseLeaveEdge: null,
        handleClickEdge: null
      }
  
      const nodeInteractionValue: NodeInteractionContextType = {
        activeNode: currIdx,
        hoveredNode: null,
        nodeHistory: null,
        visitedPath: null,
        currentNode: null,
        gameStatus: null
      }
  
      const edgeInteractionValue: EdgeInteractionContextType = {
        activeEdge: null,
        hoveredEdge: null,
        edgeHistory: null,
        visitedPath: null
      }
  
      return (
        <div className="flex flex-col items-center">
          <div>
            <GraphSettingsProvider value={graphSettingsValue}>
              <NodeInteractionProvider value={nodeInteractionValue}>
                <EdgeInteractionProvider value={edgeInteractionValue}>
                  {
                    rows.map((row, rowIndex) => (
                      <React.Fragment key={rowIndex}>
                        <PathRow row={row} rowIndex={rowIndex}/>
                        {
                          rowIndex < rows.length - 1 && (
                            <PathVerticalEdge rowIndex={rowIndex}/>
                          )
                        }
                      </React.Fragment>
                    ))
                  }
                </EdgeInteractionProvider>
              </NodeInteractionProvider>
            </GraphSettingsProvider>
          </div>
        </div>
      );
}

export default PathSelector;