import React, { Component }                                 from 'react';
import { Button, TextField }                                from '@material-ui/core';
import { Network }                                          from '../../network';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Panel                                                from '../Panel';

export interface LoginProps {
  network: Network
  loggedIn: () => void
  toRegister: () => void
}

export class LoginForm {
  email: string    = '';
  password: string = '';
}

export default class Login extends Component<LoginProps, any> {

  validate = (values: LoginForm) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid Email';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  onSubmit = (values: LoginForm, helpers: FormikHelpers<LoginForm>) => {
    this.props.network.auth.login(values.email, values.password).then((result: { token: string } | 'logged-in' | 'not-found') => {
      if (typeof result === 'object' && result.token) {
        this.props.network.auth.session = {
          email: values.email,
          token: result.token,
        };
        this.props.loggedIn();
        return;
      }
      helpers.setSubmitting(false);
      if (result === 'logged-in') {
        console.error('Already Logged In!');
      } else {
        console.error('Invalid Credentials');
      }

    });
  };

  render() {
    return <>
      <Panel uiName="login" title="Login">
        {(focused) => (
          <Formik
            initialValues={new LoginForm()}
            validate={this.validate}
            onSubmit={this.onSubmit}
          >
            {({
                isSubmitting,
                /* and other goodies */
              }) => (
              <Form autoComplete="no">
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
                <br/>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Login
                </Button>
                &nbsp;
                <Button type="button" onClick={this.props.toRegister}>
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Panel>
    </>;
  }
}
