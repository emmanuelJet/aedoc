// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	strfmt "github.com/go-openapi/strfmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// DecodeCalldataSource decode calldata source
// swagger:model DecodeCalldataSource
type DecodeCalldataSource struct {

	// Calldata to dissect
	// Required: true
	Calldata EncodedByteArray `json:"calldata"`

	// Name of the function to call
	// Required: true
	Function *string `json:"function"`

	// options
	Options *CompileOpts `json:"options,omitempty"`

	// (Possibly partial) Sophia contract code
	// Required: true
	Source *string `json:"source"`
}

// Validate validates this decode calldata source
func (m *DecodeCalldataSource) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateCalldata(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateFunction(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateOptions(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSource(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *DecodeCalldataSource) validateCalldata(formats strfmt.Registry) error {

	if err := m.Calldata.Validate(formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("calldata")
		}
		return err
	}

	return nil
}

func (m *DecodeCalldataSource) validateFunction(formats strfmt.Registry) error {

	if err := validate.Required("function", "body", m.Function); err != nil {
		return err
	}

	return nil
}

func (m *DecodeCalldataSource) validateOptions(formats strfmt.Registry) error {

	if swag.IsZero(m.Options) { // not required
		return nil
	}

	if m.Options != nil {
		if err := m.Options.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("options")
			}
			return err
		}
	}

	return nil
}

func (m *DecodeCalldataSource) validateSource(formats strfmt.Registry) error {

	if err := validate.Required("source", "body", m.Source); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *DecodeCalldataSource) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *DecodeCalldataSource) UnmarshalBinary(b []byte) error {
	var res DecodeCalldataSource
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
