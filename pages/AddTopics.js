import NavigationPage from "../component/NavComponent";
import { Container, Row, Form, FormGroup, Button, Col } from "react-bootstrap";
import "../styles/addtopics.css";
import React, { useState, useRef } from "react";
// import { useRecoilState } from "recoil";
// import { loggedInUserData } from '../lib/recoil-atoms';
// import { verify } from 'jsonwebtoken';
// import { token } from '../authentication/token';
import fetch from "isomorphic-unfetch";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { Topicslist } from "../TopicsList";

// import { useStateUser, useDispatchUser } from '../lib/UserContext';

const AddTopicsTagPage = ({ verification }) => {
  const data = Topicslist;
  // let data = { 1: 'sneezing', 2: 'eating', 3: 'walking', 4: 'talking', 5: 'chating', 6: 'hugging', 7: 'fighting', 8: 'stealing', 9: 'shoplifing', 10: 'gangfight' }
  const [Radio, setRadio] = useState("");
  const [ADD_link, setADD_link] = useState("");
  const [validated, setValidated] = useState(false);
  const [Passed, setPassed] = useState(false);
  const formRef = useRef(null);
  const username = useSelector((state) => state.Username);
  // const user = useRecoilValue(loggedInUserData);
  // const username = useStateUser();
  // const dispatch = useDispatchUser();
  // const dispatchUserInformation = (user) => dispatch({
  //     type: 'AddUser',
  //     payload: username
  // })
  // const [user, setUser] = useRecoilState(loggedInUserData)
  // useEffect(() => {
  //     const data = localStorage.getItem('unknown-list')
  //     if (data) {
  //         setUser(JSON.parse(data));
  //     }
  // })
  // localStorage.setItem('unknown-list', JSON.stringify(user))
  const handleReset = () => {
    formRef.current.reset();
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    // event.persist()
    // event.stopPropagation();
    event.persist();
    const form = event.currentTarget;
    // event.preventDefault();
    if (form.checkValidity() === false) {
      alert("..........validation");
      event.preventDefault();
      event.stopPropagation();
    }

    event.preventDefault();
    const res = await fetch("http://localhost:3003/api/AddLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topics: Radio,
        link: ADD_link,
        createdby: username, //user.username
      }),
    });
    const json = await res.json();
    if (json.Inserted) {
      document.getElementById("main-btn").disabled = true;
      document.getElementById("main-btn").value = "sending";
      document.getElementById("main-btn").style.background = "green";
      document.getElementById("message").style.color = "green";
      setPassed("Passed...........");
    } else {
      document.getElementById("main-btn").disabled = true;
      document.getElementById("main-btn").value = "Failed";
      document.getElementById("main-btn").style.background = "red";
      document.getElementById("message").style.color = "red";

      setPassed("Failed Retry..............");
      // event.preventDefault();
      event.stopPropagation();
    }

    document.getElementById("main-btn").disabled = false;
    document.getElementById("main-btn").value = "Submit";
    document.getElementById("main-btn").style.background = "#007AFC";
    // dispatchUserInformation(username);
    setValidated(true);
    setADD_link("");
    setRadio("");
    handleReset();

    // try {
    //     const res = await fetch('http://localhost:3003/api/')
    // }
  };

  return (
    <React.Fragment>
      <NavigationPage></NavigationPage>
      <Container>
        <Row>
          <Form
            ref={formRef}
            validated={validated}
            id="contact-form"
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <Row>
              <Col md={12}>
                <FormGroup></FormGroup>
              </Col>
            </Row>
            <Form.Label as="legend" column sm={2}>
              <h2>Topics</h2>
            </Form.Label>
            <Row>
              <fieldset>
                <Form.Group
                  as={Row}
                  className="inputGroup"
                  controlId="validationCustom01"
                  role="form"
                >
                  {data.map((item) => (
                    <Col className="formGroup columns" sm={2} md={2} lg={2}>
                      {/* <Button variant="primary" size='lg' id={item} onClick={() => setSelected()}> */}

                      <Form.Check
                        required
                        type="radio"
                        label={item}
                        name="radio"
                        id={item}
                        value={item}
                        onClick={(e) => setRadio(e.target.value)}
                        feedback="please select the topic"
                      />

                      {/* </Button> */}
                    </Col>
                  ))}
                  {/* <Form.Control.Feedback>Selected</Form.Control.Feedback> */}
                </Form.Group>
              </fieldset>
            </Row>
            <Row>
              <Col className="columns2" md={12}>
                <FormGroup controlid="exampleForm.ControlTextarea1" role="form">
                  <Form.Label column="lg">AddLink</Form.Label>
                  <Form.Control
                    required
                    size="lg"
                    controlid="Message"
                    as="textarea"
                    rows="5"
                    onChange={(e) => setADD_link(e.target.value)}
                    value={ADD_link}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please add the link
                  </Form.Control.Feedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Button
                  id="main-btn"
                  type="submit"
                  variant="primary"
                  className="btn main-btn float-right"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
          <i id="message" style={{ "color ": "green" }}>
            {Passed}
          </i>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default AddTopicsTagPage;

AddTopicsTagPage.getInitialProps = async (ctx) => {
  const cookie = ctx.req?.headers.cookie;
  if (!ctx.req) {
    const resp = await fetch("http://localhost:3003/api/auth_check", {
      headers: {
        cookie: cookie,
      },
    });
    if (resp.status === 401 && !ctx.req) {
      Router.replace("/");
      return {};
    }

    const json = await resp.json();
    return { verification: json };
  } else {
    const resp = await fetch("http://localhost:3003/api/auth_check", {
      headers: {
        cookie: cookie,
      },
    });
    if (resp.status === 401 && ctx.req) {
      ctx.res?.writeHead(302, {
        Location: "http://localhost:3003/",
      });
      ctx.res?.end();
      return;
    }
    const json = await resp.json();
    return { verification: json };
  }
};
