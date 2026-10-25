// logo/home links, list filter, slide-out menu


document.querySelector(".logo").addEventListener("click",function(){
  var location=(window.location.href).split('#')[0];
  window.location.href=location;
  show_hide_date_filter(1);
  getJobCards();
});

document.querySelector("#home").addEventListener("click",function(){
  var location=(window.location.href).split('#')[0];
  window.location.href=location;
  show_hide_date_filter(1);
  getJobCards();
});

// filter functionality

document.querySelector("[name='monthFilter']").addEventListener("change",filter);

function filter(){
  var location=(window.location.href).split('#')[1];

  if(location=="prosfores"){
    getOfferCards();
  }
  else if(location=="ergasies"){
    getJobStatus();
  }
  else if(location=="arxeio"){
    let filter= document.querySelector("[name='filter']").value;
    if(filter=="jobs"){
      getArchivedJobs();    }
    else if(filter=="offers"){
      getArchivedOffers();
    }
  }
  else if(location=="diathesimotita"){
    getAvailability();
  }
  else if(location=="oikonomika"){

  }
  else {getJobCards();}
}

// nav bar functionality initialization
(function menu_nav() {
  function init() {
    var menu = document.getElementById("bt-menu"),
      trigger = menu.querySelector("a.bt-menu-trigger"),
      // triggerPlay only for demo 6
      triggerPlay = document.querySelector("a.bt-menu-trigger-out"),
      resetMenu = function () {
        classie.remove(menu, "bt-menu-open");
        classie.add(menu, "bt-menu-close");
      },
      closeClickFn = function (ev) {
        resetMenu();
        overlay.removeEventListener("click", closeClickFn);
      };

    var overlay = document.createElement("div");
    overlay.className = "bt-overlay";
    menu.appendChild(overlay);

    trigger.addEventListener("click", function (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      if (classie.has(menu, "bt-menu-open")) {
        resetMenu();
      } else {
        classie.remove(menu, "bt-menu-close");
        classie.add(menu, "bt-menu-open");
        overlay.addEventListener("click", closeClickFn);
      }
    });

    if (triggerPlay) {
      triggerPlay.addEventListener("click", function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        classie.remove(menu, "bt-menu-close");
        classie.add(menu, "bt-menu-open");
        overlay.addEventListener("click", closeClickFn);
      });
    }
  }

  init();
})();


