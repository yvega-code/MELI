function callMerecadoLibreAPI() {
  // Leyendo valores del formulario HTML
  var tbSiteId = document.getElementById("siteId").value;
  var tbSellerId = document.getElementById("sellerId").value;

  /////////////////// LLAMADO A PRIMERA API ///////////////////
  console.log('Realizando llamado API Items por Seller...');
  var request1 = new XMLHttpRequest();
  request1.open('GET', 'https://api.mercadolibre.com/sites/' + tbSiteId + '/search?seller_id=' + tbSellerId, true);
  request1.onload = function () {
    var fs = '';
    var count = 0;
    // Verificación código de respuesta de llamado HTTP
    if (request1.status >= 200 && request1.status < 400) {
      // Lectura del JSON1
      console.log('Lectura de valores en JSON 1...');
      var jsonData1 = JSON.parse(this.response);
      var cantRes = jsonData1.results.length
      console.log('Cantidad de Resultados: ' + cantRes);
      for (var i = 0; i < jsonData1.results.length; i++) {
        var itemId = JSON.stringify(jsonData1.results[i].id);
        var itemTitle = JSON.stringify(jsonData1.results[i].title);
        var categoryId = JSON.stringify(jsonData1.results[i].category_id);

        /////////////////// LLAMADO A SEGUNDA API /////////////////// 
        function APIConsultaNombreCategoria(xitemId, xitemTitle, xcategoryId, xcantRes) {
          console.log('Realizando llamado API Nombre de Categoría...')
          var request2 = new XMLHttpRequest();
          request2.open('GET', 'https://api.mercadolibre.com/categories/' + xcategoryId.replace(/"/g, ""), true);  // Remuevo las comillas para el segmento URL
          request2.onload = function () {

            // Verificación código de respuesta de llamado HTTP
            if (request2.status >= 200 && request2.status < 400) {
              // Lectura del JSON2
              console.log('Lectura de valores en JSON 2...')
              var jsonData2 = JSON.parse(this.response);
              var categoryName = JSON.stringify(jsonData2.name);

              // Concatenación de valores para creación de Archivo
              fs = fs + "\n Item ID: " + xitemId + "  Titulo: " + xitemTitle + " ID Categoría: " + xcategoryId + " Nombre de Categoría: " + categoryName
              count++;
              console.log('count=' + count);
              if (count == xcantRes) {
                // Función para guardar resultados en archivo
                function download(content, fileName, contentType) {
                  var a = document.createElement("a");
                  var file = new Blob([content], { type: contentType });
                  a.href = URL.createObjectURL(file);
                  a.download = fileName;
                  a.click();
                }
                download(fs, 'items.txt', 'text/plain');
              }
            }
            else {
              console.log('Error API 2!');
              alert('Error API 2!');
            }
          }
          request2.send();
        }
        APIConsultaNombreCategoria(itemId, itemTitle, categoryId, cantRes);
      }
    }
    else {
      console.log('Error API 1!');
      alert('Error API 1!');
    }
  }
  request1.send();
}