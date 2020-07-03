import React, { useState, useEffect } from "react";
import NavigationPage from "../component/NavComponent";
import "../styles/topicsstyle.css";
import "../styles/addtopics.css";

import { Button, Badge } from "react-bootstrap";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Router from "next/router";
import ToolkitProvider, {
  CSVExport,
  Search,
} from "react-bootstrap-table2-toolkit";
const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

var date = new Date();
const TotalReportPage = (props) => {
  const [tableValue, setTableValue] = useState([]);
  const [Message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  // setTopics()
  function headFormatter(column, colIndex, { sortElement, filterElement }) {
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
        {sortElement}
      </div>
    );
  }
  const columns = [
    {
      dataField: "id",
      text: "id",
      editable: false,
      headerFormatter: headFormatter,
    },
    {
      dataField: "Topic",
      text: "Topic",
      editable: false,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "Total_Uploaded_Video",
      text: "Total_Uploaded_Video",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "No_Of_Video_Tagged",
      text: "No_Of_Video_Tagged",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "No_Of_Video_UnTagged",
      text: "No_Of_Video_UnTagged",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "Overall_Video_Timing",
      text: "Overall_Video_Timing",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "TaggedTiminig",
      text: "TaggedTiminig",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "Downloaded",
      text: "Downloaded",
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "UnDownloaded",
      text: "UnDownloaded",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
    {
      dataField: "Download_Failed",
      text: "Download_Failed",
      editable: false,
      sort: true,
      filter: textFilter(),
      headerFormatter: headFormatter,
    },
  ];
  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <button
            key={option.text}
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            className={`btn ${isSelect ? "btn-secondary" : "btn-primary"}`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );

  const options = {
    sizePerPageRenderer,
  };
  const handleDataChange = ({ dataSize }) => {
    setCount(dataSize);
  };
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(
        "http://localhost:3003/api/TotalReportGenerate",
        {
          method: "GET",
        }
      );

      const json = await resp.json();
      if (json.success == "Pass") {
        for (let index in json.result) {
          json.result[index]["id"] = parseInt(index) + 1;
        }
        setTableValue(json.result);
        setMessage("Passed.........");

        // setCount(json.result.length)
      } else {
        setMessage("Failed..........");
      }
    };
    fetchData();
  }, []);

  const onSubmitHandle = async () => {
    const resp = await fetch("http://localhost:3003/api/TotalReportGenerate", {
      method: "GET",
    });
    const json = await resp.json();
    if (json.success) {
      for (let index in json.result) {
        json.result[index]["id"] = parseInt(index) + 1;
      }
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

      <ToolkitProvider
        keyField="id"
        data={tableValue}
        columns={columns}
        exportCSV={{
          onlyExportFiltered: true,
          exportAll: false,
          fileName: "TotalReport" + date + ".csv",
        }}
        search
      >
        {(props) => (
          <div>
            <ExportCSVButton {...props.csvProps}>Export CSV!!</ExportCSVButton>
            <Button variant="primary" className="btn main-btn float-right">
              Count: <Badge variant="light">{count}</Badge>
            </Button>
            <hr />
            <SearchBar {...props.searchProps} />
            <BootstrapTable
              wrapperClasses=".table-responsive"
              {...props.baseProps}
              keyField="id"
              data={tableValue}
              columns={columns}
              noDataIndication="Table is Empty"
              pagination={paginationFactory(options)}
              filter={filterFactory()}
              onDataSizeChange={handleDataChange}
            />
          </div>
        )}
      </ToolkitProvider>
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

export default TotalReportPage;

TotalReportPage.getInitialProps = async (ctx) => {
  const cookie = ctx.req?.headers.cookie;
  if (!ctx.req) {
    const resp = await fetch("http://localhost:3003/api/auth_check_admin", {
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
    const resp = await fetch("http://10.101.1.245:3003/api/auth_check_admin", {
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
