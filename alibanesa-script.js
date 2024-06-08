(function () {
  window.lfka = {};

  function changeDetailsFunc() {
    try {
      let target = document.querySelector("#etapa1detalhes");
      if (!target) return;

      if (!target.querySelector("#collapseAditionals")) {
        let aditionalText = target?.querySelector("#headingTwo .panel-title");

        if (!aditionalText?.innerHTML.trim().includes("Adicionais")) return;

        target.classList.add("isAditionals");

        target
          ?.querySelector("#headingTwo")
          ?.insertAdjacentHTML(
            "beforeend",
            '<button id="collapseAditionals"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 18 18"><path fill="#494c4e" d="M17.707 5.707l-8 8a1 1 0 0 1-1.414 0l-8-8A1 1 0 0 1 1 4h16a1 1 0 0 1 .924.617A.97.97 0 0 1 18 5a1 1 0 0 1-.293.707z"/></svg></button>'
          );

        target
          ?.querySelector("#collapseAditionals")
          ?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.target.closest("#collapseAditionals").classList.toggle("active");
            e.target
              .closest("#etapa1detalhes")
              .querySelector(".panel-body")
              .classList.toggle("active");
          });
      }
    } catch (error) {
      console.error("[lfka error]" + error);
      clearInterval(changeDetails);
    }
  }

  function preventLocalizationError() {
    try {
      let changeTarget = document.querySelector("#btnCorrigirLocalizacao");
      let confirmTarget = document.querySelector("#btnConfirmarLocalizacao");

      if (!changeTarget || window.lfka.eventListenerLocalization) return;

      window.lfka.eventListenerLocalization = true;

      changeTarget.addEventListener("click", () => {
        confirmTarget.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          let lat = document
            .querySelector("#Lat")
            .getAttribute("value")
            .replace(",", ".");
          let lng = document
            .querySelector("#Lng")
            .getAttribute("value")
            .replace(",", ".");
          let address = document
            .querySelector("#Address")
            .getAttribute("value");

          let key = "AIzaSyAGNvpDQ4gs57bQ1-UKErIoG6IsURXqCzE";

          let endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;

          fetch(endpoint)
            .then(function (response) {
              return response.json();
            })
            .then(function (json) {
              let street = json.results[0].address_components[1].long_name;
              let district = json.results[0].address_components[2].long_name;
              let city = json.results[0].address_components[3].long_name;
              let state = json.results[0].address_components[4].short_name;
              let zipCode =
                json.results[0].address_components[6].long_name.replace(
                  "-",
                  ""
                );

              let zipCodeAddress = {
                uf: state,
                cidade: city,
                logradouro: street,
                bairro: district,
                cep: zipCode,
                provider: "googleMaps",
                success: true,
              };

              $.ajax({
                url: `/endereco/completarendereco`,
                data: zipCodeAddress,
                type: "GET",
                success: function (response) {
                  window.OnSuccessBuscarCep(response);
                  window.lfka.eventListenerLocalization = false;
                },
              });
            });
        });
      });
    } catch (error) {
      console.error("[lfka error]" + error);
      clearInterval(changeDetails);
    }
  }

  function changeTimeText() {

    if (window.lfka.changeTime === true) return
    
    const tempoRetirar = document.querySelector('.tempoEstimadoSelected')?.innerText.split('-')[0]
    const tempoEntrega = document.querySelector('.tempoEstimadoSelected')?.innerText.split('-')[1].replace('min','')

    document.querySelector('.tempoEstimadoSelected').innerText = `Retirar: ${tempoRetirar}min - Entregar: ${parseInt(tempoEntrega)-25}min-${tempoEntrega}min`

    window.lfka.changeTime = true
  }

  // change aditional details
  const changeDetails = setInterval(() => {
    if (window.location.search.includes("nolfka")) return;
    try {
      changeDetailsFunc();
      preventLocalizationError();
      changeTimeText();
    } catch (error) {
      console.error("[lfka error]" + error);
      clearInterval(changeDetails);
    }
  }, 300);
})();
