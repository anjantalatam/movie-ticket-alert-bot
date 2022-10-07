function displayAvailability(movieName, data) {
  console.log("Movie: ", movieName);
  Object.keys(data).forEach((d) => {
    console.log(`${data[d].date}: Bookings ${data[d].status}`);
  });
}

module.exports = { displayAvailability };
