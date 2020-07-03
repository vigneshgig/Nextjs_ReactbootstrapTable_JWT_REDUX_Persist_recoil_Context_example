import React, { useState, useEffect } from "react";
import NavigationPage from "../component/NavComponent";
import "../styles/topicsstyle.css";
import { Dropdown, FormControl, Button } from "react-bootstrap";
import { Topicslist } from "../TopicsList";
import Table from "../component/TableComponent";
import { useSelector, useDispatch } from "react-redux";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ActionAllTopicCount, ActionCountTable } from "../store";

const TopicsTagPage = (props) => {
  const TopicsArray = Topicslist;
  const [dropdowntopics, setDropdowntopics] = useState(TopicsArray[0]);
  const counts = useSelector((state) => state.count);
  const [count, setCount] = useState(counts);
  const dispatch = useDispatch();
  // const alltopiccount_dict = useSelector((state) => state.alltopiccount)
  const username = useSelector((state) => state.Username);
  const alltopiccount_dict = useSelector((state) => state.alltopiccount);
  const [Message, setMessage] = useState("");
  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const handleSelect = (eventkey, event) => {
    setDropdowntopics(eventkey);
  };
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [value, setValue] = useState("");

      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value ||
                child.props.children[0]
                  .toLowerCase()
                  .startsWith(value.toLowerCase())
            )}
          </ul>
        </div>
      );
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("http://localhost:3003/api/GetTopics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics: dropdowntopics,
          tagged: "0",
          username: username,
        }),
      });
      const json = await resp.json();
      if (json.success === "Pass") {
        await dispatch(ActionCountTable(json.count));
        await setCount(json.count);
        await dispatch(ActionAllTopicCount(json.alltopiccount));
        await setMessage("Passed.........");
      } else {
        setMessage("Failed..........");
      }
    };
    fetchData();
  }, [dropdowntopics, count]);
  const fetchData = async () => {
    const resp = await fetch("http://localhost:3003/api/GetTopics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topics: dropdowntopics,
        tagged: "0",
        username: username,
      }),
    });
    const json = await resp.json();
    if (json.success === "Pass") {
      await dispatch(ActionAllTopicCount(json.alltopiccount));
      await setCount(json.setCount);
    } else {
      setMessage("Failed..........");
    }
  };
  const handledata = () => {
    if (alltopiccount_dict) {
      console.log(".........................", alltopiccount_dict);
      return Object.keys(alltopiccount_dict).map((item, index) => (
        <Dropdown.Item id={item} eventKey={item}>
          {item} ({alltopiccount_dict[item]})
        </Dropdown.Item>
      ));
    } else {
      const f = fetchData().then((response) => setTimeout(2000));
      console.log(alltopiccount_dict, "...............");
      let tmp = {};
      if (alltopiccount_dict) {
        tmp = alltopiccount_dict;
        alert(tmp);
      } else {
        tmp = {
          chating: 0,
          eating: 0,
          fighting: 0,
          gangfight: 0,
          hugging: 0,
          shoplifing: 0,
          sneezing: 0,
          stealing: 2,
          talking: 0,
          walking: 0,
        };
      }

      return Object.keys(tmp).map((item, index) => (
        <Dropdown.Item id={item} eventKey={item}>
          {item} ({tmp[item]})
        </Dropdown.Item>
      ));
    }
  };
  return (
    <React.Fragment>
      <NavigationPage />
      <Button variant="primary" className="float-right">
        Upload:{count}
      </Button>
      <Dropdown onSelect={handleSelect}>
        <Button id="topicsdropdown" variant="light">
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            {dropdowntopics}
          </Dropdown.Toggle>
        </Button>

        <Dropdown.Menu as={CustomMenu}>{handledata()}</Dropdown.Menu>
      </Dropdown>
      <Table selectedTopics={dropdowntopics} user={username} />
    </React.Fragment>
  );
};

export default TopicsTagPage;

TopicsTagPage.getInitialProps = async (ctx) => {
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
