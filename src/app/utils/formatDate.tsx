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

export const formatRangeDate = (startDate: any, endDate: any) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const start = new Date(startDate)
    .toLocaleDateString("en-US", options)
    .toUpperCase();
  const end = new Date(endDate)
    .toLocaleDateString("en-US", options)
    .split(" ")[1];

  return `${start}-${end}`;
};
