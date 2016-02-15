// Using pattern from https://www.discovermeteor.com/blog/query-constructors/

queries = {};

queryConstructor = function(args) {

  var queryName = !!args ? args.queryName : "default";

  var queryFunction = queries[queryName],
      parameters = queryFunction(args);

  if (parameters.options.limit > 100) {
    parameters.options.limit = 100;
  }

  if (!parameters.options.limit || parameters.options.limit === "") {
    parameters.options.limit = 25;
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
      limit: 25
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
