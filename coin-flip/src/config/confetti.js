export default {
  angle: "0",
  spread: "360",
  startVelocity: "11",
  elementCount: "70",
  dragFriction: "0.09",
  duration: "2000",
  delay: "0",
  width: "8px",
  height: "16px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

export const endConfetti = angle => {
  return {
    angle: angle,
    spread: "50",
    startVelocity: 70,
    elementCount: "100",
    dragFriction: "0.10",
    duration: "2000",
    stagger: "8",
    width: "10px",
    height: "40px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };
};
