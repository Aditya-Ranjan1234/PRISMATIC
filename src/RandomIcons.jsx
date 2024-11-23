import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faDesktop, faWifi } from "@fortawesome/free-solid-svg-icons";

const icons = [faCamera, faDesktop, faWifi];

const RandomIcons = () => {
  const numIcons = 20;
  const iconElements = [];
  const usedPositions = new Set();

  const avoidAreas = [{ left: 2, top: 10, width: 10, height: 50 }];

  const isPositionInAvoidArea = (x, y) => {
    return avoidAreas.some((area) => {
      return (
        x >= area.left &&
        x <= area.left + area.width &&
        y >= area.top &&
        y <= area.top + area.height
      );
    });
  };

  while (iconElements.length < numIcons) {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;

    if (isPositionInAvoidArea(randomX, randomY)) continue;

    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const positionKey = `${randomX}-${randomY}`;
    if (usedPositions.has(positionKey)) continue;

    usedPositions.add(positionKey);
    iconElements.push(
      <div
        key={iconElements.length}
        style={{
          position: "absolute",
          left: `${randomX}vw`,
          top: `${randomY}vh`,
          fontSize: "2rem",
          color: "black",
          opacity: 0.3,
        }}
      >
        <FontAwesomeIcon icon={randomIcon} />
      </div>
    );
  }

  return <>{iconElements}</>;
};

export default RandomIcons;
