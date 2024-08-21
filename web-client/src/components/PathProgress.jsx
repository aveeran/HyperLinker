import React, { useState } from 'react';

function PathProgress({ start, end, path, visited = [], edge_history = [], node_history = [] }) {
  visited.push(start); // Add the start step to visited
  const steps = [start, ...path, end];

  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [activeLink, setActiveLink] = useState(null);

  const handleMouseEnterNode = (index) => {
    setHoveredNode(index);
  };

  const handleMouseLeaveNode = () => {
    if (activeNode === null) {
      setHoveredNode(null);
    }
  };

  const handleMouseEnterLink = (index) => {
    setHoveredLink(index);
  };

  const handleMouseLeaveLink = () => {
    if (activeLink === null) {
      setHoveredLink(null);
    }
  };

  const handleClickNode = (index) => {
    setActiveNode(prevActiveNode => (prevActiveNode === index ? null : index));
    setActiveLink(null); // Clear link history when clicking on a node
  };

  const handleClickLink = (index) => {
    setActiveLink(prevActiveLink => (prevActiveLink === index ? null : index));
    setActiveNode(null); // Clear node history when clicking on a link
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center w-full p-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center justify-center w-12 h-12 border-2 rounded-full relative z-10 cursor-pointer p-2 ${
                visited.includes(step) ? 'bg-blue-500 text-white' : 'bg-white border-gray-300'
              } ${activeNode === index ? 'border-orange-400' : ''}`}
              onMouseEnter={() => handleMouseEnterNode(index)}
              onMouseLeave={handleMouseLeaveNode}
              onClick={() => handleClickNode(index)}
              title={step.title}
            >
              <p className="truncate text-sm" aria-label={step.title}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-2 flex-1 ${
                  visited.includes(steps[index]) && visited.includes(steps[index + 1]) ? 'bg-green-500' : 'bg-gray-300'
                }`}
                style={{ margin: '0 0.5rem' }}
                onMouseEnter={() => handleMouseEnterLink(index)}
                onMouseLeave={handleMouseLeaveLink}
                onClick={() => handleClickLink(index)}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {(hoveredNode !== null || activeNode !== null || hoveredLink !== null || activeLink !== null) && (
        <div className="mt-4 p-2 border border-gray-300 bg-white rounded shadow-lg m-2">
          {(activeNode !== null || hoveredNode !== null) && (
            <div>
              <h3 className="font-bold">Node History for {steps[activeNode ?? hoveredNode]?.title}</h3>
              <ul>
                {node_history[activeNode ?? hoveredNode]?.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {entry.join(' → ')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(activeLink !== null || hoveredLink !== null) && (
            <div>
              <h3 className="font-bold">Edge History for Link between {steps[hoveredLink]?.title} and {steps[hoveredLink + 1]?.title}</h3>
              <ul>
                {edge_history[activeLink ?? hoveredLink]?.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {entry.join(' → ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PathProgress;
