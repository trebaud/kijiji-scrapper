const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

module.exports = {
  capitalize,
  sleep,
};
