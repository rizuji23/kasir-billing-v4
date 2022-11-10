document.addEventListener("DOMContentLoaded", function (event) {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("show-sidebar");
        toggle.classList.toggle("bx-x");
        bodypd.classList.toggle("body-pd");
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  let input_element = document.querySelector("input");

  input_element.addEventListener("keyup", () => {
    input_element.setAttribute("value", input_element.value);
  });
});

$(document).ready(function () {
  $(".form-control").click(function () {
    $(this).parent().addClass("label-animate");
  });

  $(window).click(function () {
    if (!$(event.target).is(".form-control")) {
      $(".form-control").each(function () {
        if ($(this).val() == "") {
          $(this).parent().removeClass("label-animate");
        }
      });
    }
  });
});
