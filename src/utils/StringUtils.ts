export const properText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.split("_").join(" ").slice(1);
};
