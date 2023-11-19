export const convertISOtoShortDate = (value) => {
  const date = new Date(value);
  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  const formattedDate = date.toLocaleDateString("en-SG", options);
  return formattedDate;
};
export const convertISOtoDate = (value) => {
  const date = new Date(value);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-SG", options);
  return formattedDate;
};

export const convertISOtoTime = (value) => {
  const date = new Date(value);
  const formattedTime = date
    .toLocaleTimeString("en-SG", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toUpperCase();
  return formattedTime;
};


export const convertISOto24 = (value) => {
  const date = new Date(value);
  const formattedTime = date
    .toLocaleTimeString("en-SG", {
      hour: "numeric",
      minute: "numeric",
    })
    .toUpperCase();
  return formattedTime;
};
