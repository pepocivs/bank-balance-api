var i18n = require('i18n');

module.exports = {
  format : format
};

function format(callData, filters) {
  console.log(filters);
  var finalData = [];
  callData.forEach(function(data) {
    //Just if you want to parse some fields of give some special treathment to the object
    data.tags = parseTags(data.tags);
    if (filters.idtag) {
      var tagsArr = filters.idtag.split(',');
      var isIn    = false;
      data.tags.forEach(function(tag) {
        if (tagsArr.indexOf(tag._id)>-1 && !isIn) {
          isIn = true;
          finalData.push(data);
        }
      })
    } else {
      finalData.push(data);
    }
  });
  return finalData;
}

function parseTags(tags) {
  var newTags = [];
  if (tags) {
    tags.split(';').forEach(function(tagData) {
      var arrData = tagData.split('|');
      newTags.push({
        '_id': arrData[0],
        'tagName': arrData[1]
      });
    });
  }
  return newTags;
}
