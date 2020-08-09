import React, { Component }  from 'react';
import './Login.scss';
import { Formik }            from 'formik';
import { Button, TextField } from '@material-ui/core';
import { SocketClient }      from '../../connection/socketClient';

export interface LoginProps {
  onRegister: () => void
}

export default class Login extends Component<LoginProps, any> {

  validate = (values: { email: string, password: string }) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid Email Address';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  onSubmit = (values: { email: string, password: string }, { setSubmitting }) => {
    console.log('send request');
    SocketClient.socket.emit('request', {
      event: 'account.login',
      data : values,
    }, (result) => {
      console.log('got login result', result);
    });
    setSubmitting(false);
  };

  render() {
    return <div className="login">
      <h3>Login</h3>
      <div className="login-form">
        <Formik
          initialValues={{ email: '', password: '' }}
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
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                Login
              </Button>
              <br/>
              <Button type="button" onClick={this.props.onRegister}>
                No Account? Register!
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>;
  }
}
