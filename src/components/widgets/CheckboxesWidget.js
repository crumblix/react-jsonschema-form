import React, {PropTypes} from "react";


function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  var ret = selected.filter(v => v !== value);
  if (ret.length == 0) {
    return undefined;
  } else {
    return ret;    
  }  
}

function CheckboxesWidget(props) {
  const {id, disabled, options, value, autofocus, readonly, multiple, onChange} = props;
  const {inline} = options;
  var {enumOptions} = options;
  var schema = props.schema;
  var {enumLabel,enumValue} = schema;
  if (multiple && schema.items) {
    if (schema.items.enumLabel) {
      enumLabel = schema.items.enumLabel;
    }
    if (schema.items.enumValue) {
      enumValue = schema.items.enumValue;
    }
  }
  if (!enumValue) {
    enumValue = "value";
  }
  if (!enumLabel) {
    enumLabel = "label";
  }
  if (!enumOptions) {
    enumOptions = [];
  }
  return (
    <div className="checkboxes" id={id}>{
      enumOptions.map((option, index) => {
        const checked = (value === undefined) ? false : value.indexOf(option[enumValue]) !== -1;
        const disabledCls = disabled || readonly ? "disabled" : "";
        const checkbox = (
          <span>
            <input type="checkbox"
              id={`${id}_${index}`}
              checked={checked}
              disabled={disabled || readonly}
              autoFocus={autofocus && index === 0}
              onChange={(event) => {
                const all = enumOptions.map(({value}) => value);
                if (event.target.checked) {
                  onChange(selectValue(option[enumValue], value, all));
                } else {
                  onChange(deselectValue(option[enumValue], value));
                }
              }}/>
            <span>{option[enumLabel]}</span>
          </span>
        );
        return inline ? (
          <label key={index} className={`checkbox-inline ${disabledCls}`}>
            {checkbox}
          </label>
        ) : (
          <div key={index} className={`checkbox ${disabledCls}`}>
            <label>
              {checkbox}
            </label>
          </div>
        );
      })
    }</div>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {
    inline: false
  },
};

if (process.env.NODE_ENV !== "production") {
  CheckboxesWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxesWidget;
