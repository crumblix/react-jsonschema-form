import React from "react";

module.exports = {
  schema: {
  "type": "object",
  "properties": {
    "idnamelist": {
      "type": "array",
      "title": "Name with hidden ID",
      "items": {
    		"type": "object",
    		"properties": {
      		"id": {
        		"type": "string",
      		},
      		"name": {
        		"type": "string",
      		}
    	 }
      }
    }
  }
},
  uiSchema: {
    idnamelist: {
      items: {
        id: {"ui:widget": "hidden"}
      }
    }
  },
  formData: {
  }
};
