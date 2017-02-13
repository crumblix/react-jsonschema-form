import React from "react";

module.exports = {
  schema: { 
    "type":"object",
    "properties": {
      "links": {
        "type":"object",
        "title":"Links",
        "required":[],
        "properties": {
          "revenuecategory": {
            "type":"object",
            "title":"Sale Projection",
            "required":[],
            "properties": {
              "83fb3da9-3724-4e1b-be48-a8cffe39da1d": {
                "type":"array",
                "items": {
                  "type":"object",
                  "properties": {
                    "id": {
                      "type":
                      "string"
                    },
                    "revenuecategory": {
                      "title":"Platform",
                      "type":"string",
                      "enumValue":"id",
                      "enumOptions":[{"id":"f5c4fff7-32e6-47f8-90b5-e26ef1b6f348"},{"id":"1c9999b0-c611-4567-b40c-0eebc5f487eb"},{"id":"ccb256ae-e9d3-4b41-b121-966547c383f1"},{"id":"480fb878-5b53-4955-8088-d212f8d892f1"},{"id":"6d297956-a7b3-42c8-9830-d9c45ff8a8a5"}, {"id":"27515e92-70ca-4822-9740-bd59f156fd17"},{"id":"353380ad-5910-41e0-a0d3-78ce63ae172e"}],
                      "enumClearable":true
                    },
                    "date": {
                      "title": "Date",
                      "type":"string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  uiSchema: {
    "ui:tab":true,
    "links": {
      "revenuecategory": {
        "83fb3da9-3724-4e1b-be48-a8cffe39da1d": {
          "ui:addable": false,
          items: {
            id: {"ui:widget": "hidden"}
          }
        }
      }
    }
  },
  formData: {
    "links": {
      "revenuecategory": {
        "83fb3da9-3724-4e1b-be48-a8cffe39da1d": [
        {
          "id": "ID1",
          "date": "AAAA"
        }]
      }
    }
  }
};
