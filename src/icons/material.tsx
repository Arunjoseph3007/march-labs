import { IMaterial } from "@/types/material";

export const MaterialIcon = (material: IMaterial) => (
  <div
    style={{ backgroundColor: `rgb(${material.color})` }}
    className="h-6 w-6 rounded-full flex items-center justify-center"
  >
    <div className="w-4 h-4 bg-zinc-950 rounded-full" />
  </div>
);
