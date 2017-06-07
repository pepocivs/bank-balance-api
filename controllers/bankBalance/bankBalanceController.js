var bankBalanceDao = require('../../lib/dao/bankBalance/bankBalanceDao.js');
var _              = require('lodash');
var i18n           = require('i18n');

// 2 - Add daoCall and go to dao

module.exports = {
  getBalance: _.partial(callDao, 'getBalance', 'balanceData')
};

function callDao(daoFunction, dataParser, req, res) {
  i18n.setLocale(req.headers['accept-language'] || 'en_US');
  var db         = req.db;
  var configData = { 'body': req.body };
  var filters    = getFilters(req);

  bankBalanceDao[daoFunction](db, configData, filters, function(err, data) {
    if (!hasError(res, err))
      sendData(res, data, dataParser, filters);
  });
}

function sendData(res, data, conversor, filters) {
  var finalData = require('../../lib/dataConvert/'+conversor+'.js').format(data, filters);
  if (!finalData) res.status(400).send({'Error' : true, 'Message' : 'Problem connecting to database'});
  else            res.status(200).send(finalData);
}

function hasError(res, err) {
  if (err) res.status(400).send({
    'Error' : true,
    'Message' : err
  });
  return err;
}

function getFilters(req) {
  var filters = req.query || {};

  // Securize filters
  Object.keys(filters).forEach(function(key) {
    filters[key] = (!parseInt(filters[key])>0) ? req.db.escape(filters[key]) : filters[key];
  });

  // Adding params to filters
  Object.keys(req.params).forEach(function(key) {
    filters[key] = (!parseInt(filters[key])>0) ? req.db.escape(req.params[key]) : req.params[key];
  });
  return filters;
}
