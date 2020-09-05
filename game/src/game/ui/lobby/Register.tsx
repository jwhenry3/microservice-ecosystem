import React, { Component }                                 from 'react';
import { Button, TextField }                                from '@material-ui/core';
import { Network }                                          from '../../network';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Panel }                                            from '@jwhenry/react-windows';

export interface RegisterProps {
  network: Network
  registered: () => void
  toLogin: () => void
}

export class RegisterForm {
  email: string           = '';
  password: string        = '';
  confirmPassword: string = '';
}

export default class Register extends Component<RegisterProps, any> {

  validate = (values: RegisterForm) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid Email';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords Must Match';
    }
    return errors;
  };

  onSubmit = (values: RegisterForm, helpers: FormikHelpers<RegisterForm>) => {
    this.props.network.auth.register(values.email, values.password).then((result: { token: string }) => {
      if (result.token) {
        this.props.network.auth.session = {
          email: values.email,
          token: result.token,
        };
        this.props.registered();
      }
      helpers.setSubmitting(false);
    });
  };

  render() {
    return <>
      <Panel uiName="register" title="Register">
        <Formik
          initialValues={new RegisterForm()}
          validate={this.validate}
          onSubmit={this.onSubmit}
        >
          {({
              isSubmitting,
              /* and other goodies */
            }) => (
            <Form autoComplete="off">
              <input type="email" hidden id="Email" value="Email" name="hidden-email" readOnly={true}/>
              <input type="password" hidden id="Password" value="Password" name="hidden-password" readOnly={true}/>
              <Field name="email">
                {({ field, form, meta }) => (
                  <TextField variant="outlined" type="email" label="Email Address"
                             autoComplete="new-email" {...field}/>
                )}
              </Field><br/>
              <div className="error"><ErrorMessage name="email" component="div"/></div>
              <Field name="password">
                {({ field, form, meta }) => (
                  <TextField variant="outlined" type="password" label="Password"
                             autoComplete="new-password" {...field}/>
                )}
              </Field><br/>
              <div className="error"><ErrorMessage name="password" component="div"/></div>
              <Field name="confirmPassword">
                {({ field, form, meta }) => (
                  <TextField variant="outlined" type="password" label="Confirm Password"
                             autoComplete="new-password" {...field}/>
                )}
              </Field><br/>
              <div className="error"><ErrorMessage name="confirmPassword" component="div"/></div>
              <br/>
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                Register
              </Button>&nbsp;
              <Button type="button" onClick={this.props.toLogin}>
                Have an account?
              </Button>
            </Form>
          )}
        </Formik>
      </Panel>
    </>;
  }
}
