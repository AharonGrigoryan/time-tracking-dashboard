async function getDashboardData(url = "./data.json") {
  const response = await fetch(url);
  // console.log(response);
  const data = await response.json();
  console.log(data);

  return data;
}

class dashbordItem {
  static PERIODS = {
    daily: "day",
    weekly: "week",
    monthly: "month",
  };

  constructor(data, container = ".dashbord_content", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this.createMarkup();
  }
  createMarkup() {
    const { title, timeframes } = this.data;

    const id = title.toLowerCase().replace(/ /g, "-");
    console.log(id);
    const { current, previous } = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML(
      "beforeend",
      `
    <div class="dashbord_item dashbord_item--${id}" >
    <article class="tracking-card">
      <header class="tracking-card_header">
        <h4 class="tracking-card_title">${title}</h4>
        <img class="tracking-card_menu" src="images/icon-ellipsis.svg" alt="menu">
      </header>
      <div class="tracking-card_body">
        <div class="tracking-card_time">
          ${current}hrs
        </div>
        <div class="tracking-card_prev-period">
         Last ${dashbordItem.PERIODS[this.view]} - ${previous}hrs
        </div>
      </div>
    </article>
  </div
    `
    );
    this.time = this.container.querySelector(
      `.dashbord_item--${id} .tracking-card_time`
    );
    this.prev = this.container.querySelector(
      `.dashbord_item--${id} .tracking-card_prev-period`
    );
  }

  changeView(view) {
    //   console.log(this.data.title);
    this.view = view.toLowerCase();
    const { current, previous } = this.data.timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${
      dashbordItem.PERIODS[this.view]
    } - ${previous}hrs`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashboardData().then((data) => {
    const activities = data.map((activity) => new dashbordItem(activity));

    const selectors = document.querySelectorAll(".view_selector_item");
    // console.log(selectors);
    selectors.forEach((selector) => {
      selector.addEventListener("click", function () {
        selectors.forEach((sel) =>
          sel.classList.remove("view_selector_item--active")
        );
        selector.classList.add("view_selector_item--active");

        const currentView = selector.innerText.trim().toLowerCase();
        activities.forEach((activity) => activity.changeView(currentView));
      });
    });
  });
});
