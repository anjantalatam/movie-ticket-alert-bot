function formatBooking(data) {
  let s = "";
  Object.keys(data).forEach((d) => {
    s += `${data[d].date}: Bookings ${data[d].status}\n`;
  });
  return s;
}

function displayAvailability(movieName, data) {
  let formatString = "";
  formatString += `Movie: ${movieName}\n`;
  formatString += formatBooking(data);
  return formatString;
}

module.exports = { displayAvailability };
