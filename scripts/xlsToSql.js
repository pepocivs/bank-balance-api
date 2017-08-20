var XLSX = require('xlsx');
var moment = require('moment');

var fileName = 'cuentas.xlsx';
var requiredPage = 'Cuentas y Saldos';

var workbook = XLSX.readFile(fileName);

var sheet_name_list = workbook.SheetNames;

sheet_name_list.forEach(function(y) {
  if(y === requiredPage) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        if(isInRange(col)) {
          //store header names
          if(row == 1 && value) {
              headers[col] = value;
              continue;
          }

          if(!data[row]) data[row]={};
          data[row][headers[col]] = value;
        }
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();

    var finalData = categorizeItems(data);

    finalData.forEach(function(d) {
      console.log(d);
    });
  }
});


function isInRange(col) {
  var range = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  return (range.indexOf(col) > -1);
}

function categorizeItems(data) {
  var max = 9999999999999;
  var count = 0;
  var finalData = [];
  data.forEach(function(register) {
    if (count < max) {
      var date = new Date((register.Fecha - (25567 + 1))*86400*1000);
      finalData.push({
        'date': moment(date).format('YYYY-MM-DD'),
        'concept': register.Concepto,
        'categories': getCategories(register.Concepto, register.Oficina),
        'value': (register.Pagos > 0) ? (parseFloat(register.Pagos) * -1) : parseFloat(register.Ingresos),
        'balance': register.Saldo
      });
    };
    count = count + 1;
  })
  return finalData;
}

function getCategories(concept, categoryId) {
  concept = concept.toLowerCase();
  var selectedCategories = [];
  if (categoryId !== 0) selectedCategories.push(parseInt(categoryId));
  var categories = [
    { '_id': 1, 'name': 'Gasto mudanza Madrid' },
    { '_id': 2, 'name': 'Gato' },
    { '_id': 3, 'name': 'Cto España Juvenil Fem' },
    { '_id': 4, 'name': 'Comidas Fuera Casa' },
    { '_id': 5, 'name': 'Super' },
    { '_id': 6, 'name': 'Caprichos' },
    { '_id': 7, 'name': 'Transporte Publico' },
    { '_id': 8, 'name': 'Viaje a Suiza' },
    { '_id': 9, 'name': 'Viaje a Londres' },
    { '_id': 10, 'name': 'Sector Infantil Sala' },
    { '_id': 11, 'name': 'Cto España Infantil Sala' },
    { '_id': 12, 'name': 'Fase Ascenso 1ª Fem' },
    { '_id': 13, 'name': 'Cto España Cadete' },
    { '_id': 14, 'name': 'Sector Cadete' },
    { '_id': 15, 'name': 'Torneo THIAGO' },
    { '_id': 16, 'name': 'Vacaciones' },
    { '_id': 17, 'name': 'Viajes a VLC' },
    { '_id': 18, 'name': 'Pokemon' },
    { '_id': 19, 'name': 'Giner' },
    { '_id': 20, 'name': 'Regalos' },
    { '_id': 21, 'name': 'Arbitrajes FHCV 16-17' },
    { '_id': 22, 'name': 'Sector Copa Cadete' },
    { '_id': 23, 'name': 'Carnet de Conducir' },
    { '_id': 24, 'name': 'Viaje a Nueva York' },
    { '_id': 25, 'name': 'MWC' },
    { '_id': 26, 'name': 'Switch' },
    { '_id': 27, 'name': 'DHB y DHF' },
    { '_id': 28, 'name': 'Cto España Infantil Sala' },
    { '_id': 29, 'name': 'Cto España Cadete' },
    { '_id': 30, 'name': 'Sector Cadete' },
    { '_id': 31, 'name': 'Sector Juvenil' },
    { '_id': 32, 'name': 'Polymer Summit' },
    { '_id': 33, 'name': 'AVE'},
    { '_id': 34, 'name': 'Valencia'},
    { '_id': 35, 'name': 'Madrid'},
    { '_id': 36, 'name': 'CNA'},
    { '_id': 37, 'name': 'CVA'},
    { '_id': 38, 'name': 'CMA'},
    { '_id': 39, 'name': 'Amena'},
    { '_id': 40, 'name': 'Orange'},
    { '_id': 40, 'name': 'Phone'},
    { '_id': 41, 'name': 'Efectivo'},
    { '_id': 41, 'name': 'Cajero'},
    { '_id': 42, 'name': 'SW'},
  ];

  categories.forEach(function(category) {
    var categoryName = category.name.toLowerCase();
    if (concept.indexOf(categoryName)>-1 && selectedCategories.indexOf(category._id) === -1) {
      selectedCategories.push(category._id);
    }
  });

  return selectedCategories;
}
