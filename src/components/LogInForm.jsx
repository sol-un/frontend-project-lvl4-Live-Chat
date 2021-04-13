import React, { useRef, useEffect } from 'react';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';

export default () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div className="container-fluid">
      <div className="row justify-content-center pt-5">
        <div className="col-sm-4">
          <Formik
            initialValues={{
              login: '',
              password: '',
            }}
            onSubmit={(values) => console.log(values)}
          >
            {(props) => {
              const { handleSubmit, handleChange } = props;
              return (
                <Form className="p-3" onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label htmlFor="login">Ваш ник</Form.Label>
                    <Form.Control
                      required
                      onChange={handleChange}
                      id="login"
                      name="login"
                      ref={inputRef}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="password">Пароль</Form.Label>
                    <Form.Control required onChange={handleChange} id="password" name="password" />
                  </Form.Group>
                  <Button className="w-100 mb-3" type="submit" variant="outline-primary">Войти</Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};
