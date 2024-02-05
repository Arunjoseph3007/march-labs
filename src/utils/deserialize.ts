const cache: Record<string, string> = {};

export const deserialize = async (resource: string) => {
  if (cache[resource]) return cache[resource];
  
  const res = await fetch(resource);
  const text = await res.text();
  cache[resource] = text;
  return text;
};
