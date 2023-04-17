export const properText = (text: string) => {
  return text.charAt(0).toUpperCase() + text.split("_").join(" ").slice(1);
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  // in YYYY-MM-DD format
  return d.toISOString().split("T")[0];
}

export const textOrDash = (text: string) => {
  return text ? text : "-";
}