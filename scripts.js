function callMerecadoLibreAPI(){

  // Leyendo valores del formulario HTML
  var tbSiteId = document.getElementById("siteId").value;
  var tbSellerId = document.getElementById("sellerId").value;

  /////////////////// LLAMADO A PRIMERA API ///////////////////
  console.log('Realizando llamado API Items por Seller...');
  var request1 = new XMLHttpRequest();
  request1.open('GET', 'https://api.mercadolibre.com/sites/' + tbSiteId + '/search?seller_id=' + tbSellerId, true);
  request1.onload = function() {
    
    // Verificación código de respuesta de llamado HTTP
    if (request1.status >= 200 && request1.status < 400) {
      console.log('Lectura de valores en JSON 1...');
        
      // Lectura del JSON1
        var jsonData1 = JSON.parse(this.response);
        
        var itemId = JSON.stringify(jsonData1.results[0].id);
        var itemTitle = JSON.stringify(jsonData1.results[0].title);
        var categoryId = JSON.stringify(jsonData1.results[0].category_id);

        /////////////////// LLAMADO A SEGUNDA API /////////////////// 
        console.log('Realizando llamado API Nombre de Categoría...')
        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://api.mercadolibre.com/categories/' + categoryId.replace(/"/g, ""), true);  // Remuevo las comillas para el segmento URL
        request2.onload = function() {

          // Verificación código de respuesta de llamado HTTP
          if (request2.status >= 200 && request2.status < 400) {
            console.log('Lectura de valores en JSON 2...')

            // Lectura del JSON2
            var jsonData2 = JSON.parse(this.response);
            var categoryName = JSON.stringify(jsonData2.name);

            // Concatenación de valores para creación de Archivo
            var fs = " Item ID: " + itemId + "  Titulo: " + itemTitle + " ID Categoría: " + categoryId + " Nombre de Categoría: " + categoryName

            // Función para guardar resultados en archivo
            function download(content, fileName, contentType) {
              var a = document.createElement("a");
              var file = new Blob([content], {type: contentType});
              a.href = URL.createObjectURL(file);
              a.download = fileName;
              a.click();
            }
            download(fs, 'json.txt', 'text/plain');
          } 
          else {
            console.log('Error!');
            alert('Error!');
          }
        }
        request2.send();
    } 
    else {
      console.log('Error!');
      alert('Error!');
    }
  }
  request1.send();
}