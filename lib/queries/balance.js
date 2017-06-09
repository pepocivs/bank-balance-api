module.exports = {
  get : get
};

function get(filters, body, tools) {
  // - Set the behavior of the filters with your query
  // - "?" is replaceb by value on body
  // - types: 'integer', 'string', 'stringLike', 'boolean', you can add more in tools/tools.js
  var equivalences = {
    'id'    : {
      'condition' : 'b._id = ?',
      'type'      : 'integer'
    },
    'search'    : {
      'condition' : 'b.description LIKE "%?%"',
      'type'      : 'string'
    },
    'year'    : {
      'condition' : 'YEAR(b.date) = ?',
      'type'      : 'integer'
    },
    'month'    : {
      'condition' : 'MONTH(b.date) = ?',
      'type'      : 'integer'
    }

  };
  // You can add an array of querys [query1, query2], and there are executed one by one
  // query must be a string or an array of strings
  var query = 'SELECT b.*, '+
              '(SELECT GROUP_CONCAT(CONCAT(COALESCE(t._id, ""), "|", COALESCE(t.tag, "")) SEPARATOR ";") '+
              				       'FROM balanceTags bt '+
                             'LEFT JOIN tags t ON bt.idTag = t._id '+
                             'WHERE bt.idBalance = b._id) AS tags '+
              'FROM balance b '+
              tools.parseFilters(filters, equivalences, false)+';';
              // console.log(query);
  return query;
}
