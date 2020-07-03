import React, { useState, useEffect } from "react";
import NavigationPage from "../component/NavComponent";
import "../styles/topicsstyle.css";
import { Button, Badge } from "react-bootstrap";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Router from "next/router";

const AdminPage = (props) => {
  const [tableValue, setTableValue] = useState([]);
  const [Message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const TimeFormat = (cell, row) => {
    return <pre>{cell}</pre>;
  };
  function headFormatter(column, colIndex, { filterElement }) {
    return (
      <div
        style={{
          "overflow-wrap": "break-word",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong>{column.text}</strong>
        {filterElement}
      </div>
    );
  }
  // setTopics()
  const columns = [
    {
      dataField: "id",
      text: "ID",
      editable: false,
      filter: textFilter(),
    },
    {
      dataField: "Link",
      text: "Link",
      editable: false,
      filter: textFilter(),
      headerFormatter: headFormatter,
      formatter: TimeFormat,
      style: {
        cursor: "pointer",
        color: "blue",
      },
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          let url = row.Link;
          window.open(url);
        },
      },
    },
    {
      dataField: "Starting",
      text: "Start (00hrs:00min:00sec)",
      filter: textFilter(),
      editable: false,
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "Ending",
      text: "End (00hrs:00min:00sec)",
      filter: textFilter(),
      editable: false,
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "Topic",
      text: "Topic",
      filter: textFilter(),
      editable: false,
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "Tagged",
      text: "Tagged",
      editable: false,
      filter: textFilter(),
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "CreatedBy",
      text: "CreatedBy",
      editable: false,
      filter: textFilter(),
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "AssignedTo",
      text: "AssignedTo",
      editable: false,
      filter: textFilter(),
      formatter: TimeFormat,
      headerFormatter: headFormatter,
    },
    {
      dataField: "DATETIME",
      text: "DATETIME",
      filter: textFilter(),
      editable: false,
      headerFormatter: headFormatter,
    },
  ];
  const options = {
    // pageStartIndex: 0,
    sizePerPage: 5,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: true,
  };
  const handleDataChange = ({ dataSize }) => {
    setCount(dataSize);
  };
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("http://localhost:3003/api/GetLink", {
        method: "GET",
      });
      const json = await resp.json();
      if (json.success) {
        setTableValue(json.result);
        // setCount(json.result.length)
        setMessage("Passed.........");
      } else {
        setMessage("Failed..........");
      }
    };
    fetchData();
  }, []);

  const onSubmitHandle = async () => {
    const resp = await fetch("http://localhost:3003/api/GetLink", {
      method: "GET",
    });
    const json = await resp.json();
    if (json.success) {
      setTableValue(json.result);
      // setCount(json.result.length)
      setMessage("Passed.........");
    } else {
      setMessage("Failed..........");
    }
  };

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
  return (
    <React.Fragment>
      <NavigationPage />
      <Button variant="primary">
        Count: <Badge variant="light">{count}</Badge>
      </Button>
      <BootstrapTable
        keyField="id"
        data={tableValue}
        columns={columns}
        noDataIndication="Table is Empty"
        pagination={paginationFactory(options)}
        filter={filterFactory()}
        onDataSizeChange={handleDataChange}
      />
      <Button
        id="tableupdate"
        variant="primary"
        className="btn main-btn float-right"
        size="lg"
        onClick={onSubmitHandle}
      >
        Update
      </Button>
    </React.Fragment>
  );
};

export default AdminPage;

AdminPage.getInitialProps = async (ctx) => {
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
    const resp = await fetch("http://10.101.1.245:3003/api/auth_check", {
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
    return { logout: json.logout };
  }
};
