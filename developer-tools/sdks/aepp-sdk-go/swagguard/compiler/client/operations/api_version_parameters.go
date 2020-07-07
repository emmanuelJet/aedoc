// Code generated by go-swagger; DO NOT EDIT.

package operations

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"
	"net/http"
	"time"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/runtime"
	cr "github.com/go-openapi/runtime/client"

	strfmt "github.com/go-openapi/strfmt"
)

// NewAPIVersionParams creates a new APIVersionParams object
// with the default values initialized.
func NewAPIVersionParams() *APIVersionParams {

	return &APIVersionParams{

		timeout: cr.DefaultTimeout,
	}
}

// NewAPIVersionParamsWithTimeout creates a new APIVersionParams object
// with the default values initialized, and the ability to set a timeout on a request
func NewAPIVersionParamsWithTimeout(timeout time.Duration) *APIVersionParams {

	return &APIVersionParams{

		timeout: timeout,
	}
}

// NewAPIVersionParamsWithContext creates a new APIVersionParams object
// with the default values initialized, and the ability to set a context for a request
func NewAPIVersionParamsWithContext(ctx context.Context) *APIVersionParams {

	return &APIVersionParams{

		Context: ctx,
	}
}

// NewAPIVersionParamsWithHTTPClient creates a new APIVersionParams object
// with the default values initialized, and the ability to set a custom HTTPClient for a request
func NewAPIVersionParamsWithHTTPClient(client *http.Client) *APIVersionParams {

	return &APIVersionParams{
		HTTPClient: client,
	}
}

/*APIVersionParams contains all the parameters to send to the API endpoint
for the API version operation typically these are written to a http.Request
*/
type APIVersionParams struct {
	timeout    time.Duration
	Context    context.Context
	HTTPClient *http.Client
}

// WithTimeout adds the timeout to the API version params
func (o *APIVersionParams) WithTimeout(timeout time.Duration) *APIVersionParams {
	o.SetTimeout(timeout)
	return o
}

// SetTimeout adds the timeout to the API version params
func (o *APIVersionParams) SetTimeout(timeout time.Duration) {
	o.timeout = timeout
}

// WithContext adds the context to the API version params
func (o *APIVersionParams) WithContext(ctx context.Context) *APIVersionParams {
	o.SetContext(ctx)
	return o
}

// SetContext adds the context to the API version params
func (o *APIVersionParams) SetContext(ctx context.Context) {
	o.Context = ctx
}

// WithHTTPClient adds the HTTPClient to the API version params
func (o *APIVersionParams) WithHTTPClient(client *http.Client) *APIVersionParams {
	o.SetHTTPClient(client)
	return o
}

// SetHTTPClient adds the HTTPClient to the API version params
func (o *APIVersionParams) SetHTTPClient(client *http.Client) {
	o.HTTPClient = client
}

// WriteToRequest writes these params to a swagger request
func (o *APIVersionParams) WriteToRequest(r runtime.ClientRequest, reg strfmt.Registry) error {

	if err := r.SetTimeout(o.timeout); err != nil {
		return err
	}
	var res []error

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}
