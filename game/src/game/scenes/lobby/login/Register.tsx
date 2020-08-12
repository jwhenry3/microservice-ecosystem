import React, { Component }                  from 'react';
import { Button }                            from '@material-ui/core';
import { Network }                           from '../../../network';
import { ErrorMessage, Field, Form, Formik } from 'formik';

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

  onSubmit = (values: RegisterForm) => {
    this.props.network.auth.register(values.email, values.password).then((result: { token: string }) => {
      if (result.token) {
        this.props.network.auth.session = {
          email: values.email,
          token: result.token,
        };
        this.props.registered();
      }
    });
  };

  render() {
    return <div className="panel">
      <div className="backdrop"/>
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
            <Field type="email" name="email" placeholder="Email Address" autoComplete="new-password"/><br/>
            <ErrorMessage name="email" component="div"/><br/>
            <Field type="password" name="password" placeholder="Password" autoComplete="new-password"/><br/>
            <ErrorMessage name="password" component="div"/><br/>
            <Field type="password" name="confirmPassword" placeholder="Confirm Password" autoComplete="new-password"/><br/>
            <ErrorMessage name="confirmPassword" component="div"/><br/>
            <br/>
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              Register
            </Button><br/><br/>
            <Button type="button" onClick={this.props.toLogin}>
              Have an account?
            </Button>
          </Form>
        )}
      </Formik>
    </div>;
  }
}
