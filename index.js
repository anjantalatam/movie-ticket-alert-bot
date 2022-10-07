const puppeteer = require("puppeteer");
const { displayAvailability } = require("./helper");

async function run() {
  //   const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const city = "Kakinada";
  const URL = "https://www.inoxmovies.com/";
  const movie = "God Father";
  const date = "10/10/2022";
  const limit = 10;

  try {
    await page.goto(URL);
    console.log(`✅ URL ${URL} loaded \n`);
  } catch {
    console.log(`❌ Failed to load the URL: ${URL} \n`);
  }

  //   await page.screenshot({ path: "example.png" });

  try {
    await page.click(`div[cityname="${city}"]`);
    console.log(`✅ City ${city} selected \n`);
  } catch (err) {
    console.log(`❌ City ${city} not found! \n`);
    await browser.close();
  }

  page.once("load", async () => {
    console.log(`✅ Movies in ${city} loaded \n`);

    try {
      await page.click(`a[title="${movie}"]`);
      console.log(`✅ Movie ${movie} selected \n`);
    } catch (err) {
      console.log(`❌ Movie ${city} not found! \n`);
      await browser.close();
    }

    // page.once("load", async () => {
    //   console.log(`✅ ${movie} slots loaded \n`);

    //   try {
    //     await page.click(`div[data-fd="${date}"]`);
    //     console.log(`✅ Date ${date} selected \n`);
    //   } catch (err) {
    //     console.log(`❌ Date ${date} not found! \n`);
    //     await browser.close();
    //   }
    // });

    page.once("load", async () => {
      const getAvailability = await page.evaluate(() => {
        const dates = document.querySelectorAll(
          // eslint-disable-next-line comma-dangle
          ".ShowTimeContainer div[data-fd]"
        );

        const availability = {};

        for (let i = 0; i < 10; i += 1) {
          const element = dates[i];
          const movieDate = element.getAttribute("data-fd");
          const bookingStatus =
            element.getAttribute("data-st") === "True" ? "Open" : "Not Open";

          const dateDetails =
            element.querySelector(".spnSmallTodayText").innerText;

          availability[movieDate] = {
            date: dateDetails,
            status: bookingStatus,
          };
        }

        return availability;
      });

      displayAvailability(movie, getAvailability);
      await browser.close();
    });
  });
}

// const fn = setTimeout(run, 5000);
run();
// const fn = setTimeout(run, 7200000);
