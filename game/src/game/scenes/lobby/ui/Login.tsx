import React, { Component }                  from 'react';
import { Button }                            from '@material-ui/core';
import { Network }                           from '../../../network';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Panel                                 from '../../../ui/Panel';

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

  onSubmit = (values: LoginForm) => {
    this.props.network.auth.login(values.email, values.password).then((result: { token: string }) => {
      if (result.token) {
        this.props.network.auth.session = {
          email: values.email,
          token: result.token,
        };
        this.props.loggedIn();
      }
    });
  };

  render() {
    return <>
      <div className="backdrop"/>
      <Panel title="Login">
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
              <Field type="email" name="email" placeholder="Email Address" autoComplete="new-password"/><br/>
              <ErrorMessage name="email" component="div"/><br/>
              <Field type="password" name="password" placeholder="Password" autoComplete="new-password"/><br/>
              <ErrorMessage name="password" component="div"/><br/>
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
      </Panel>
    </>;
  }
}
