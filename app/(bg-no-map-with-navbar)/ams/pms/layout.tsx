import React from "react";

export default function PMSLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 p-1">{children}</div>;
}
