(function () {
  "use strict";

  window.onload = function () {
    $("#Movie-tab").click(handleMovieTab);
    $("#Series-tab").click(handleServiceTab);
    $("#Movie input").on("keyup", function (event) {
      debounce(() => handleCreateDemo("movie", event.target.value))();
    });
    $("#Series input").on("keyup", function (event) {
      console.log('event', event)
      const value = event.target.value;
      if (event.target.name === "id") {
        debounce(() => handleCreateDemo("series", value))();
      }
      if (event.target.name === "season") {
        const movieId = $("#Series input")[1].value;
        const episode = $("#Series input")[3].value;
        debounce(() => handleCreateDemo("series", movieId, value, episode))();
      }
      if (event.target.name === "episode") {
        const season = $("#Series input")[2].value;
        const movieId = $("#Series input")[1].value;
        debounce(() => handleCreateDemo("series", movieId, season, value))();
      }
    });
    $("#Series input").on("click", function () {
      const season = $("#Series input")[2].value;
      const movieId = $("#Series input")[1].value;
      const episode = $("#Series input")[3].value;
      debounce(() => handleCreateDemo("series", movieId, season, episode))();
    });
  };
})();

let timer;
function debounce(func, timeout = 300) {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function handleMovieTab() {
  const input = $("#Movie input")[1];
  const movieId = input.getAttribute("data-default");
  setAttribute(input, "value", movieId);
  handleCreateDemo("movie", movieId);
}

function handleServiceTab() {
  const input = $("#Series input")[1];
  const movieId = input.getAttribute("data-default");
  setAttribute(input, "value", movieId);
  handleCreateDemo("series", movieId);
  setAttribute($("#Series input")[2], "value", "");
  setAttribute($("#Series input")[3], "value", "");
}

function setAttribute(element, name, value) {
  element.value = value;
  element.setAttribute(name, value);
}

function handleCreateDemo(type, movieId, season, episode) {
  let embed = "https://gomovies.bet/v2/embed";
  const linkDemo = $("#link-demo")[0];
  if ("movie" === type) {
    embed = `${embed}/movie/${movieId}`;
  } else if ("series" === type) {
    embed = `${embed}/tv/${movieId}`;
  }
  if ("series" === type && season) {
    embed = `${embed}/${season}`;
  }
  if ("series" === type && episode) {
    if (!season) {
      embed = `${embed}/1/${episode}`;
    } else {
      embed = `${embed}/${episode}`;
    }
  }
  setAttribute(linkDemo, "value", embed);
  const iframePlayer = $("<iframe>", {
    title: "player",
    scrolling: "no",
    frameborder: 0,
    marginWidth: 0,
    allowfullscreen: "yes",
    src: embed,
    allow: "autoplay; fullscreen",
    style: "width: 100%; height: 100%; overflow: hidden;",
    referrerpolicy: "no-referrer-when-downgrade",
  });
  $("#player").empty();
  $("#player")[0].append(iframePlayer[0]);
}
