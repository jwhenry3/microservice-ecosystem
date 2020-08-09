import React, { Component }  from 'react';
import './Login.scss';
import { Formik }            from 'formik';
import { Button, TextField } from '@material-ui/core';
import { SocketClient }      from '../../connection/socketClient';

export interface RegisterProps {
  onLogin: () => void
}

export default class Register extends Component<RegisterProps, any> {


  validate = (values: { email: string, password: string, confirmPassword: string }) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid Email Address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Password and Confirm Password must match';
    }
    return errors;
  };

  onSubmit = (values: { email: string, password: string, confirmPassword: string }, { setSubmitting }) => {
    console.log('submit!');

    SocketClient.socket.emit('request', {
      event: 'account.register',
      data : values,
    }, (result) => {
      if (result && result.token) {
        console.log('got register result', result);
        SocketClient.token = result.token;
        SocketClient.email = values.email;
      }
    });
    setSubmitting(false);
  };

  render() {
    return <div className="login">
      <h3>Register</h3>
      <div className="login-form">
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validate={this.validate}
          onSubmit={this.onSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="field">
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}/>
                <div>{errors.email && touched.email && errors.email}</div>
              </div>
              <br/>
              <div className="field">
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}/>
                <div>{errors.password && touched.password && errors.password}</div>
              </div>
              <br/>
              <div className="field">
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}/>
                <div>{errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}</div>
              </div>
              <br/>
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                Register
              </Button>
              <br/>
              <Button type="button" onClick={this.props.onLogin}>
                Have An Account? Login!
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>;
  }
}
