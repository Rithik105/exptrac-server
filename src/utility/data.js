const hasData = (value) => {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !(typeof value === "number" && isNaN(value))
  );
};

module.exports = { hasData };
