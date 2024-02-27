/// <reference types="cypress" />
const pkceChallenge = require("pkce-challenge");
/**
 * @type {Cypress.PluginConfig}
 */

//let username = [];

module.exports = async (on) => {
  const getChallenge = await pkceChallenge();

  on("task", {
    getChallenge: () => {
      return getChallenge;
    },
  });
};

module.exports = async (on) => {
  on("task", {
    async usernameDateTime(username) {
      let date = new Date();

      //get current date
      let day = ("0" + date.getDate()).slice(-2);
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();

      //Convert email into test+yyyymmddhhmmss@test.com format
      var baseEmailArr = username.split("@");
      baseEmailArr.splice(
        1,
        0,
        "+" + year + month + day + hours + minutes + seconds + "@"
      );
      return baseEmailArr.join("");
    },
  });
};

// eslint-disable-next-line no-unused-vars
/*module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    async hotmailLoginHeaded ({email, password}) {
      const browser = await puppeteer.launch({ headless: false })

      const page = await browser.newPage()
    await page.goto('https://login.live.com/')

    await page.waitFor('input[type=email]', { visible: true })
    await page.type('input[type=email]', email)
    await page.click('input[type=submit]')

    await page.waitFor('input[type=password]', { visible: true })
    await page.type('input[type=password]', password)

    await page.waitFor('input[type=checkbox]', { visible: true })
    await page.click('input[type=checkbox]')
    }
  })

}*/
