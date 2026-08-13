/* eslint-disable react-refresh/only-export-components */
import React from "react";

const flagClass = "w-6 h-auto rounded-[2px] ring-1 ring-black/15 shrink-0";

const Star = ({ x, y, s = 0.5 }) => (
  <path
    d="M0,-1 L0.2245,-0.309 L0.9511,-0.309 L0.3633,0.118 L0.5878,0.809 L0,0.382 L-0.5878,0.809 L-0.3633,0.118 L-0.9511,-0.309 L-0.2245,-0.309 Z"
    transform={`translate(${x},${y}) scale(${s})`}
    fill="#fff"
  />
);

const UzFlag = () => (
  <svg viewBox="0 0 24 12" className={flagClass} aria-hidden="true">
    <rect width="24" height="12" fill="#0099b5" />
    <rect y="6" width="24" height="0.75" fill="#ce1126" />
    <rect y="6.75" width="24" height="3" fill="#fff" />
    <rect y="9.75" width="24" height="0.75" fill="#ce1126" />
    <rect y="10.5" width="24" height="1.5" fill="#1eb53a" />
    <circle cx="3.3" cy="3" r="1.5" fill="#fff" />
    <circle cx="4.3" cy="3" r="1.15" fill="#0099b5" />
    {[5.6, 6.9, 8.2, 9.5, 10.8].map((x) => <Star key={x} x={x} y={2.2} />)}
    {[6.25, 7.55, 8.85, 10.15].map((x) => <Star key={x} x={x} y={3} />)}
    {[6.9, 8.2, 9.5].map((x) => <Star key={x} x={x} y={3.8} />)}
  </svg>
);

const RuFlag = () => (
  <svg viewBox="0 0 30 20" className={flagClass} aria-hidden="true">
    <rect width="30" height="20" fill="#fff" />
    <rect y="6.67" width="30" height="6.66" fill="#0039a6" />
    <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
  </svg>
);

const UkFlag = () => (
  <svg viewBox="0 0 60 30" className={flagClass} aria-hidden="true">
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="8" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" strokeWidth="12" />
    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

export const FLAGS = {
  uz: <UzFlag />,
  ru: <RuFlag />,
  en: <UkFlag />,
};
