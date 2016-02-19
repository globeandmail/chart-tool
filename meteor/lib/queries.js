// Using pattern from https://www.discovermeteor.com/blog/query-constructors/

queries = {};

queryConstructor = function(args) {

  var queryName = !!args ? args.queryName : "default";

  var queryFunction = queries[queryName],
      parameters = queryFunction(args);

  if (!parameters.options) {
    parameters.options = {};
  }

  if (parameters.options.limit > 100) {
    parameters.options.limit = 100;
  }

  if (!parameters.options.limit || parameters.options.limit === "") {
    parameters.options.limit = 50;
  }

  return parameters;

}

queries.default = function () {
  return {
    find: {},
    options: {
      sort: {
        lastEdited: -1
      },
      limit: 50
    }
  }
};


queries.chartArchive = function (params) {

  var types = params.filters.types,
      tags = params.filters.tags;

  if (!types.length && !tags.length) {
    return queries.default();
  } else {

    var find = {};

    if (types.length) {
      find["options.type"] = {
        $in: types
      };
    }

    if (tags.length) {
      find["tags"] = {
        $in: tags
      };
    }

    return {
      find: find,
      options: {
        sort: {
          lastEdited: -1
        },
        limit: params.limit
      }
    }
  }
};

queries.chartTags = function (params) {

  var chartId = params.chartId;

  return {
    find: { tagged: chartId }
  };

};
