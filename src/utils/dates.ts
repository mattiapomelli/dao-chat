export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const toSeconds = (date: string | number) =>
  Math.floor(new Date(date).getTime() / 1000);
