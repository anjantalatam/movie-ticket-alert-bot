/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const { displayAvailability } = require("./helper");

const store = {};

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const city = "Kakinada";
  const URL = "https://www.inoxmovies.com/";
  const movie = "God Father";
  const date = "10/19/2022";
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
      const bookingInstance = await page.evaluate(() => {
        const dates = document.querySelectorAll(
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

      const availNow = displayAvailability(movie, bookingInstance);

      // console.log(bookingInstance);

      // if (bookingInstance[date]?.status === "Open") {
      // const item = await page.$('div[data-fd="10/19/2022"]');
      // console.log(item);
      // await page.click("#divShowdayBlock_TOMORROW");
      // const movieDates = await page.$$eval(
      //   ".ShowTimeContainer div",
      //   (elements) => elements.filter((ele) => ele.getAttribute("onclick"))
      // );
      const movieDates = await page.$$(
        ".ShowTimeContainer div[data-st='True']"
      );
      // const movieDates = await page.$$(
      //   ".ShowTimeContainer div:not([onclick=''])"
      // );

      movieDates.forEach(async (ele, i) => {
        console.log(i, "in");
        await ele.click({ waitUntil: "load" });
        // await page.waitForNavigation({ waitUntil: "load" });
        await page.screenshot({ path: `image-${i}.png` });
        // eslint-disable-next-line no-promise-executor-return
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        // await page.goBack();
        // await window.history.go(-1);

        console.log(i, "out");
      });
      console.log(movieDates.length);

      const showTimes = await page.$$eval(
        "#divShowTimes div.clsShowTimeBlock",
        (elements) => elements.map((ele) => ele.getAttribute("onclick"))
        // .map((e) => e.querySelector("spnShowTimeGray").innerText)
      );

      console.log(showTimes);

      const data = [];
      // showTimes.forEach(async (elem) => {
      //   // await element.click();
      //   // // Get the data you want here and push it into the data array
      //   // await page.goBack();
      //   // const showTime = await page.evaluate((el) => el.innerHTML, elem);
      //   console.log(elem);
      //   // data.push(showTime);
      // });

      console.log(data);

      // const getShowTimes = await page.evaluate(() => {
      //   const showTimes = document.querySelectorAll(
      //     "#divShowTimes div.clsShowTimeBlock"
      //   );

      //   const activeShows = [];

      //   showTimes.forEach((show) => {
      //     const isActive = show.getAttribute("onclick") !== ""; // empty onclick return '' thus the show is expired/ inactive

      //     // show time ( ex: 11:15 AM)
      //     // const showTime = show.querySelector(".spnShowTimeGray").innerText;

      //     if (isActive) {
      //       activeShows.push(show);
      //     }
      //   });
      // });

      // const activeShows = getShowTimes;

      // console.log(activeShows);
      // }

      // if (store?.latest && store.latest?.ds !== availNow) {
      //   // Update outdated
      //   store[`outdated-${Object.keys(store).length}`] = store.latest;

      //   const model = {};
      //   model.timeStamp = new Date().toString();
      //   model.ds = availNow;
      //   model.data = bookingInstance;

      //   store.latest = model;
      // }

      // console.log(availNow);
      // await browser.close();
    });
  });
}

run();
// cron.schedule("*/1 * * * *", () => {
//   console.log("running a task in 1 minutes");
//   run();
// });
