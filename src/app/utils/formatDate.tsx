export const formatDate = (dateString: any) => {
  let date = new Date(dateString);
  let formattedDate = date.toLocaleDateString(navigator.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  });

  let parts = formattedDate.split(" ");
  parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  return parts.join(" ");
};
