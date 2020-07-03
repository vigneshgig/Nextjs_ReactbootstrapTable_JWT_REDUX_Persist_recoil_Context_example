import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "../styles/Table.css";
import { useSelector, useDispatch } from "react-redux";
import { ActionCountTable } from "../store";
import { ActionAllTopicCount, ActionCurrentUser } from "../store";
class QualityRanger extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    onUpdate: PropTypes.func.isRequired,
  };
  static defaultProps = {
    value: 0,
  };
  getValue() {
    return this.range.value;
    // return parseInt(this.range.value, 10);
  }
  render() {
    const { value, onUpdate, ...rest } = this.props;
    return [
      <form>
        <input
          {...rest}
          key="time"
          ref={(node) => (this.range = node)}
          type="time"
          step="1"
        />
      </form>,
    ];
  }
}

const Table = ({ selectedTopics, user }) => {
  const [tableValue, setTableValue] = useState([]);
  const [Message, setMessage] = useState("");
  const [selectedRow, setSelectedRow] = useState([]);
  const [defaultselected, setdefaultselected] = useState([]);
  const dispatch = useDispatch();
  dispatch(ActionCurrentUser(user));
  const username = useSelector((state) => state.Username);
  // setTopics()
  const TimeFormat = (cell, row) => {
    return <pre>{cell}</pre>;
  };
  const columns = [
    {
      dataField: "id",
      text: "ID",
      editable: false,
    },
    {
      dataField: "Link",
      text: "Link",
      editable: false,
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
      editor: {
        type: Type.TEXTAREA,
      },
      formatter: TimeFormat,
      // editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
      //     <QualityRanger {...editorProps} value={value} />
      // ),
      validator: (newValue, row, column) => {
        try {
          const json = JSON.parse(newValue);
          let regex = /(?:[0]\d|2[012345]):(?:[012345]\d):(?:[012345]\d)/;
          if (
            json.time0 === "00:00:00" ||
            json.time0 === "00:00" ||
            !regex.test(json.time0)
          ) {
            return {
              valid: false,
              message: "Time is Empty or time format is invalid or check",
            };
          }
          return true;
        } catch {
          return {
            valid: false,
            message: "check the json format",
          };
        }
      },
    },
    {
      dataField: "Ending",
      text: "End (00hrs:00min:00sec)",
      editor: {
        type: Type.TEXTAREA,
      },
      formatter: TimeFormat,
      // editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
      //     <QualityRanger {...editorProps} value={value} />
      // )
      validator: (newValue, row, column) => {
        try {
          let regex = /(?:[0]\d|2[012345]):(?:[012345]\d):(?:[012345]\d)/;

          const json = JSON.parse(newValue);

          if (
            json.time0 === "00:00:00" ||
            json.time0 === "00:00" ||
            !regex.test(json.time0)
          ) {
            return {
              valid: false,
              message: "Time is Empty or time format is invalid or check",
            };
          }
          return true;
        } catch {
          return {
            valid: false,
            message: "check the json format",
          };
        }
      },
    },
  ];
  const selectRow = {
    mode: "checkbox",
    classes: "selection-row",
    clickToSave: true,
    clickToEdit: true,
    // clickToSelect: true,
    selected: defaultselected,
  };
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("http://localhost:3003/api/GetTopics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topics: selectedTopics,
          tagged: "0",
          username: username,
        }),
      });
      const json = await resp.json();
      if (json.success === "Pass") {
        const json_tmp = json.result.map((x) => {
          x.Starting = JSON.stringify({
            time0: "00:00:00",
            time1: "00:00:00",
            time2: "00:00:00",
            time3: "00:00:00",
          });
          x.Ending = JSON.stringify({
            time0: "00:00:00",
            time1: "00:00:00",
            time2: "00:00:00",
            time3: "00:00:00",
          });
          return x;
        });
        await setdefaultselected(
          json.result.map((x) => {
            return x.id;
          })
        );
        await setTableValue(json_tmp);
        await dispatch(ActionCountTable(json.count));
        await dispatch(ActionAllTopicCount(json.alltopiccount));
        await setMessage("Passed.........");
      } else {
        setMessage("Failed..........");
      }
    };
    fetchData();
  }, [selectedTopics, user]);

  const onSubmitHandle = async (event) => {
    try {
      let checkValidation = true;
      const check = selectedRow.selectionContext.selected;

      let tableValue_tmp = [];
      let ids_tmp = [];
      if (tableValue.length === 0 || check.length === 0) {
        setMessage("Table Is Empty.....");
        checkValidation = false;
      } else {
        tableValue_tmp = tableValue.filter((dicts) => {
          return check.includes(dicts.id);
        });
        ids_tmp = tableValue.map((dicts) => {
          if (!check.includes(dicts.id)) {
            return dicts.id;
          }
        });
        for (let i = 0; i < tableValue_tmp.length; i++) {
          const tmp_start = await JSON.parse(tableValue_tmp[i].Starting);
          const tmp_end = await JSON.parse(tableValue_tmp[i].Ending);
          if (
            tmp_start.time0 === "00:00:00" ||
            tmp_start.time0 === "00:00" ||
            tmp_end.time0 === "00:00:00" ||
            tmp_end.time0 === "00:00"
          ) {
            checkValidation = false;
            document.getElementById("tableupdate").style.background = "red";
            await setMessage(
              "starting and ending time is not filled completely please it fillout and retry again...."
            );
            break;
          }
        }
      }

      if (checkValidation) {
        document.getElementById("tableupdate").style.background = "green";
        const res = await fetch("http://localhost:3003/api/SetTagTopics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: tableValue_tmp,
            ids_value: ids_tmp,
          }),
        });
        const json = await res.json();
        if (json.Updated) {
          setMessage("Set_Passed.........");
          const get_topics = await fetch(
            "http://localhost:3003/api/GetTopics",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                topics: selectedTopics,
                tagged: "0",
                username: username,
              }),
            }
          );
          const get_json = await get_topics.json();
          if (get_json.success === "Pass") {
            const json_tmp = get_json.result.map((x) => {
              x.Starting = JSON.stringify({
                time0: "00:00:00",
                time1: "00:00:00",
                time2: "00:00:00",
                time3: "00:00:00",
              });
              x.Ending = JSON.stringify({
                time0: "00:00:00",
                time1: "00:00:00",
                time2: "00:00:00",
                time3: "00:00:00",
              });
              return x;
            });
            document.getElementById("tableupdate").style.background = "green";
            await setdefaultselected(
              get_json.result.map((x) => {
                return x.id;
              })
            );
            await setTableValue(json_tmp);
            await dispatch(ActionCountTable(json.count));
            await dispatch(ActionAllTopicCount(json.alltopiccount));
            setMessage("Get_Passed.........");
            document.getElementById("tableupdate").style.background = "#007BFF";
          } else {
            document.getElementById("tableupdate").style.background = "red";
            setMessage("Get_Failed..........");
            document.getElementById("tableupdate").style.background = "#007BFF";
          }
        } else {
          document.getElementById("tableupdate").style.background = "red";
          document.getElementById("tableupdate").style.background = "#007BFF";
          setMessage("Set_Failed..........");
        }
      }
    } catch (err) {
      console.log(err, "...........error");
    }
  };

  return (
    <React.Fragment>
      <BootstrapTable
        keyField="id"
        data={tableValue}
        columns={columns}
        cellEdit={cellEditFactory({ mode: "click", blurToSave: true })}
        noDataIndication="Table is Empty"
        selectRow={selectRow}
        ref={(n) => setSelectedRow(n)}
      />
      <Button
        id="tableupdate"
        variant="primary"
        className="btn main-btn float-right"
        size="lg"
        onClick={onSubmitHandle}
      >
        Submit
      </Button>
      <i>{Message}</i>
    </React.Fragment>
  );
};

export default Table;
