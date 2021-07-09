import React, { Component } from "react";

import * as Survey from "survey-react";

import "survey-react/modern.css";
import "./index.css";

Survey.StylesManager.applyTheme("modern");

class SurveyComponent extends Component {
  constructor() {
    super();
  }
  render() {
    //Add the price property into choices
    Survey.Serializer.addProperty("itemvalue", "price:number");
    var getItemPrice = function (params) {
      //this.row property available in cells of dropdown and dynamic matrices questions
      var question = !!this.row
        ? this.row.getQuestionByColumnName(params[0])
        : null;
      //if we can't find a question inside the cell (by row and column name) then return
      if (!question) return 0;
      //get the selected item/choice
      var selItem = question.selectedItem;
      //return 0 if a user did not select the item yet.
      return !!selItem ? selItem.price : 0;
    };
    //Register the custom function
    Survey.FunctionFactory.Instance.register("getItemPrice", getItemPrice);

    const json = {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "orderList",
          rowCount: 1,
          minRowCount: 1,
          titleLocation: "none",

          columns: [
            {
              name: "id",
              title: "Id",
              cellType: "expression",
              expression: "{rowIndex}"
            },
            {
              name: "price",
              title: "Price",
              cellType: "expression",
              expression: "getItemPrice('id')",
              displayStyle: "currency"
            },
            {
              name: "quantity",
              title: "Hombres",
              isRequired: true,
              cellType: "text",
              inputType: "number",
              totalType: "sum",
              totalFormat: "Total phones: {0}",
              validators: [
                {
                  type: "numeric",
                  minValue: 1,
                  maxValue: 100
                }
              ]
            },

            {
              name: "quantity2",
              title: "Mujeres",
              isRequired: true,
              cellType: "text",
              inputType: "number",
              totalType: "sum",
              totalFormat: "Total phones: {0}",
              validators: [
                {
                  type: "numeric",
                  minValue: 1,
                  maxValue: 100
                }
              ]
            },
            {
              name: "total",
              title: "Total",
              cellType: "expression",
              expression: "{row.quantity} + {row.quantity2}",
              displayStyle: "currency",
              totalType: "sum",
              totalDisplayStyle: "currency",
              totalFormat: "Total Trabajadores: {0}"
            }
          ]
        },
        {
          name: "vatProcents",
          type: "text",
          title: "VAT (in %)",
          defaultValue: 20,
          inputType: "number",
          validators: [
            {
              type: "numeric",
              minValue: 0,
              maxValue: 40
            }
          ]
        },
        {
          name: "vatTotal",
          type: "expression",
          title: "VAT",
          expression: "{orderList-total.total} * {vatProcents} / 100",
          displayStyle: "currency",
          startWithNewLine: false
        },
        {
          name: "total",
          type: "expression",
          title: "Total",
          expression: "{orderList-total.total} + {vatTotal}",
          displayStyle: "currency",
          startWithNewLine: false
        }
      ]
    };
    const survey = new Survey.Model(json);

    return <Survey.Survey model={survey} />;
  }
}

export default SurveyComponent;
