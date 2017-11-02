module.exports = function suggestMonthly(amount) {
  // TODO: refine this function to actually do what
  // we want it to do based on the amount donated,
  // and the numbers we came up with.

  return (1.5 * parseInt(amount, 10)/12) + "";
};
