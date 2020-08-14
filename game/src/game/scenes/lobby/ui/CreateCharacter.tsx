import React, { Component }                    from 'react';
import { Network }                             from '../../../network';
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import './CreateCharacter.scss';
import Panel                                   from '../../../ui/Panel';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { HAIR_STYLE }                        from '../../../../models/character.model';

export interface CreateCharacterProps {
  network: Network
  toCharacters: () => void
}

export class CreateCharacterForm {
  name: string      = '';
  gender: string    = 'male';
  hairStyle: string = '1';
  hairColor: string = '#504127';
  skinTone: string  = '#f2c996';
  race: string      = 'human';
}

export default class CreateCharacter extends Component<CreateCharacterProps, any> {

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  validate = () => {
    let errors = {};

    return errors;
  };

  onSubmit = (values: CreateCharacterForm) => {

  };

  render() {
    return <>
      <Panel uiName="create-character" panelName="create-character" title="Create Character" canDrag={true}
             close={this.props.toCharacters}>
        <Formik
          initialValues={new CreateCharacterForm()}
          validate={this.validate}
          onSubmit={this.onSubmit}
        >
          {({
              isSubmitting,
              /* and other goodies */
            }) => (
            <Form autoComplete="off">
              <Field name="name">
                {({ field, form, meta }) => (
                  <TextField variant="outlined" label="Character Name" {...field}/>
                )}
              </Field><br/>
              <div className="error"><ErrorMessage name="name" component="div"/></div>
              <Field name="race">
                {({ field, form, meta }) => (
                  <Select variant="outlined" label="Race" {...field}>
                    <MenuItem value="human">Human</MenuItem>
                  </Select>
                )}
              </Field><br/>
              <div className="error"/>
              <Field name="hairStyle" >
                {({ field, form, meta }) => (
                  <Select variant="outlined" label="Hair Style" {...field}>
                    {HAIR_STYLE.map(value => <MenuItem value={value} key={value}>Hair Style {value}</MenuItem>)}
                  </Select>
                )}
              </Field><br/>
              <div className="error"/>
              <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                Create
              </Button>&nbsp;
              <Button type="button" onClick={this.props.toCharacters}>
                Go Back
              </Button>
            </Form>
          )}
        </Formik>
      </Panel>
    </>;
  }
}
