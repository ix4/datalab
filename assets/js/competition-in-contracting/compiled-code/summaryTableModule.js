"use strict";

var summaryTableModule = function () {
  function draw(data) {
    var _helperFunctionModule = helperFunctionModule,
        formatNumber = _helperFunctionModule.formatNumber;


    var summaryData = data.reduce(function (a, c) {
      if (c.displayed) {
        a.competedDollars += c.competedDollars;
        a.notCompetedDollars += c.notCompetedDollars;
        a.competedActions += c.competedActions;
        a.notCompetedActions += c.notCompetedActions;
      }
      return a;
    }, {
      competedDollars: 0,
      notCompetedDollars: 0,
      competedActions: 0,
      notCompetedActions: 0
    });

    d3.select("#competed-dollars").text(formatNumber("dollars text", summaryData.competedDollars));

    d3.select("#competed-actions").text(formatNumber("actions", summaryData.competedActions));

    d3.select("#not-competed-dollars").text(formatNumber("dollars text", summaryData.notCompetedDollars));

    d3.select("#not-competed-actions").text(formatNumber("actions", summaryData.notCompetedActions));
  }

  return { draw: draw };
}();
