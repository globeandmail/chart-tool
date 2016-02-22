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
    parameters.options.limit = 48;
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
      limit: 48
    }
  }
};


queries.chartArchive = function (params) {

  var types = params.filters.types,
      tags = params.filters.tags,
      searchVal = params.filters.search;

  if (!types.length && !tags.length && !searchVal) {
    return queries.default();
  } else {

    var find = {},
        options = {
          sort: { lastEdited: -1 },
          limit: params.limit
        };

    if (types.length) {
      find["options.type"] = { $in: types };
    }

    if (tags.length) {
      find["tags"] = { $in: tags };
    }

    // $text isnt supported in minimongo yet,
    // hence the server check
    if (searchVal && Meteor.isServer) {
      find.$text = { $search: searchVal };
      options.fields = {
        score: { $meta: "textScore" }
      };
      options.sort = {
        score: { $meta: "textScore" }
      };
    }

    return {
      find: find,
      options: options
    }
  }
};

queries.chartTags = function (params) {
  return {
    find: { tagged: params.chartId }
  };
};
