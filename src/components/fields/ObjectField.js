import React, { Component, PropTypes } from "react";

import { deepEquals } from "../../utils";

import {
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  shouldRender,
  getDefaultRegistry,
  setState
} from "../../utils";


class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = (index) => {
    //this.setState({current: index});
    return (event) => {
      event.preventDefault();
      this.setState({ current: index });
      //setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    const { schemaFields, schema, orderedProperties } = this.props;
    let childProps = (
      <div className="tab-content">{
        orderedProperties.map((name, index) => {
          return (<div key={"tabc" + name + index.toString()} className={this.state.current === index ? "tab-pane fade in active" : "tab-pane fade"}>
            <br />
            {schemaFields[index]}
          </div>
          );
        })
      }</div>
    );

    return (
      <div>
        <ul className="nav nav-tabs">{
          orderedProperties.map((name, index) => {
            let tabTitle = (schema.properties[name].title === undefined) ? name : schema.properties[name].title;
            return (
              <li key={"li" + name + index.toString()} className={this.state.current === index ? "active" : ""}>
                <a data-toggle="tab"
                  onClick={this.onLabelClick(index)}>
                  {tabTitle}
                </a>
              </li>
            );
          })

        }
        </ul>
        {childProps}
      </div>
    );
  }
}

function objectKeysHaveChanged(formData, state) {
  // for performance, first check for lengths
  const newKeys = Object.keys(formData);
  const oldKeys = Object.keys(state);
  if (newKeys.length < oldKeys.length) {
    return true;
  }
  // deep check on sorted keys
  if (!deepEquals(newKeys.sort(), oldKeys.sort())) {
    return true;
  }
  return false;
}

class ObjectField extends Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    const state = this.getStateFromProps(nextProps);
    const {formData} = nextProps;
    if (formData && objectKeysHaveChanged(formData, this.state)) {
      // We *need* to replace state entirely here has we have received formData
      // holding different keys (so with some removed).
      this.state = state;
      this.forceUpdate();
    } else {
      this.setState(state);
    }
  }

  getStateFromProps(props) {
    const {schema, formData, registry} = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;
  }

  asyncSetState(state, options = { validate: false }, childName) {
    setState(this, state, () => {
      this.props.onChange(this.state, options, childName);
    });
  }

  onPropertyChange = (name) => {
    return (value, options, childName) => {
      let totalName = childName ? name + "." + childName : name;
      this.asyncSetState({ [name]: value }, options, totalName);
    };
  };

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      tabPanel
    } = this.props;
    const {definitions, fields, formContext} = this.props.registry;
    const {SchemaField, TitleField, DescriptionField} = fields;
    const schema = retrieveSchema(this.props.schema, definitions);
    const title = (schema.title === undefined) ? name : schema.title;
    let orderedProperties;
    let isTab = uiSchema["ui:tab"] ? true : false;
    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema["ui:order"]);
    } catch (err) {
      return (
        <div>
          <p className="config-error" style={{ color: "red" }}>
            Invalid {name || "root"} object field configuration:
            <em>{err.message}</em>.
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }
    let orderedProps = null;
    if (isTab) {
      let schemaFields = orderedProperties.map((name, index) => {
        return (<SchemaField key={index}
          name={name}
          required={this.isRequired(name)}
          schema={schema.properties[name]}
          uiSchema={uiSchema[name]}
          errorSchema={errorSchema[name]}
          idSchema={idSchema[name]}
          formData={this.state[name]}
          onChange={this.onPropertyChange(name)}
          registry={this.props.registry}
          disabled={disabled}
          readonly={readonly}
          tabPanel={true} />
        );
      });
      orderedProps = [
        <Selector key="selectorkey" schemaFields={schemaFields} schema={schema} orderedProperties={orderedProperties} />,
      ];
    } else {
      orderedProps = orderedProperties.map((name, index) => {
        return (<SchemaField key={index}
          name={name}
          required={this.isRequired(name)}
          schema={schema.properties[name]}
          uiSchema={uiSchema[name]}
          errorSchema={errorSchema[name]}
          idSchema={idSchema[name]}
          formData={this.state[name]}
          onChange={this.onPropertyChange(name)}
          registry={this.props.registry}
          disabled={disabled}
          readonly={readonly} />
        );
      });
    }

    return (
      <fieldset>
        {title && !tabPanel ? <TitleField
          id={`${idSchema.$id}__title`}
          title={title}
          required={required}
          formContext={formContext} /> : null}
        {schema.description ?
          <DescriptionField
            id={`${idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext} /> : null}
        <div>{orderedProps}</div>
      </fieldset>
    );
  }
}

if (process.env.NODE_ENV !== "production") {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    })
  };
}

export default ObjectField;
