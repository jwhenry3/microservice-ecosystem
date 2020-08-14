import React, { Component }                                                          from 'react';
import { Network }                                                                   from '../../../network';
import {
  Button,
  ButtonGroup,
  Slider,
  TextField,
}                                                                                    from '@material-ui/core';
import './CreateCharacter.scss';
import Panel
                                                                                     from '../../../ui/Panel';
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import {
  GENDER,
  HAIR_COLOR,
  HAIR_STYLE, RACE, SKIN_TONE,
}                                      from '../../../../models/character.model';
import { CirclePicker, CompactPicker } from 'react-color';

export interface CreateCharacterProps {
  network: Network
  toCharacters: () => void
}

export class CreateCharacterForm {
  name: string      = '';
  gender: string    = 'male';
  hairStyle: number = 1;
  hairColor: string = HAIR_COLOR[0];
  skinTone: string  = SKIN_TONE[0];
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

  onSubmit = (values: CreateCharacterForm, helpers: FormikHelpers<CreateCharacterForm>) => {
    helpers.setSubmitting(false);
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
              setFieldValue,
              /* and other goodies */
            }: FormikProps<CreateCharacterForm>) => (
            <Form autoComplete="off">
              <Field name="race">
                {({ field, form, meta }: FieldProps) => (
                  <div className="">
                    <div className="field-label">Race</div>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                      {RACE.map(race => <Button key={race} className={field.value === race ? 'active' : ''}
                                                variant="contained"
                                                onClick={() => setFieldValue('race', race)}>
                        {race}
                      </Button>)}
                    </ButtonGroup></div>
                )}
              </Field>
              <Field name="gender">
                {({ field, form, meta }: FieldProps) => (
                  <div className="">
                    <div className="field-label">Gender</div>
                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                      {GENDER.map(gender => <Button key={gender} className={field.value === gender ? 'active' : ''}
                                                    variant="contained"
                                                    onClick={() => setFieldValue('gender', gender)}>
                        {gender}
                      </Button>)}
                    </ButtonGroup></div>
                )}
              </Field>
              <Field name="hairStyle">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <div className="field-label">Hair Style</div>
                    <div className="padding">
                      <Slider color="secondary"
                              defaultValue={field.value}
                              step={1}
                              min={1} max={HAIR_STYLE.length}
                              valueLabelDisplay="auto"/>
                    </div>
                  </>
                )}
              </Field>
              <Field name="hairColor">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <div className="field-label">Hair Color</div>
                    <div className="picker">
                      <CompactPicker colors={HAIR_COLOR}
                                    onChange={(color) => setFieldValue('hairColor', color.hex)}
                                    color={field.value}/>
                    </div>
                  </>
                )}
              </Field>
              <Field name="skinTone">
                {({ field, form, meta }: FieldProps) => (
                  <>
                    <div className="field-label">Skin Tone</div>
                    <div className="picker">
                      <CompactPicker colors={SKIN_TONE}
                                    onChange={(color) => setFieldValue('skinTone', color.hex)}
                                    color={field.value}/>
                    </div>
                  </>
                )}
              </Field>
              <Field name="name">
                {({ field, form, meta }) => (
                  <>
                    <div className="field-label">Character Name</div>
                    <div className="">
                      <TextField variant="outlined"{...field}/>
                    </div>
                  </>
                )}
              </Field>
              <div className="error"><ErrorMessage name="name" component="div"/></div>
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
