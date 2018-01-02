# Vue Forms Model

This project was inspired by angular2 forms.

It consists of a set of classes and a directive.

Like angular forms, it has the concepts of:

* form-group
* form-control
* form-array

Then there is a directive where we can bind vue components to forms-controls.

form-group, form-control and form-array inherit from an abtract-control class so they all share a state with the following fields:

* $dirty - the control has been interacted with
* $touch - the control has been blurred
* $valid - this model is valid
* $focus - the control is currently active
* $enable - the control is enable
* $loading - if true some async validation is running
* $errors - error object
* value - value

Usage: All form are formed by a root form-group and one or more form-controls and groups nested.

These classes mimic a JSON object:

* form-group(fg) - object {}
* form-array(fa) - array []
* form-control(fc) - primitive.

| forms model                                            | object                                                   |
| ------------------------------------------------------ | -------------------------------------------------------- |
| fg - login:<br/> - fc - username <br/> - fc - password | "login" : { <br/> "username": "", <br/> "password": "" } |

```javascript
let login = new FormGroup({
  username: new FormControl(),
  password: new FormControl()
});
```

#TODO

* Finish documentation

* Finish tests

* Finish formArray Model

* v-fc should change the component instance model

* better install script

* fill the validation service with several examples.

* enable i18n

* create a form builder
