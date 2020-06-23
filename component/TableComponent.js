
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import '../styles/Table.css';
import { useSelector, useDispatch } from 'react-redux'
import { ActionCountTable } from '../store';
import { ActionAllTopicCount } from '../store';
class QualityRanger extends React.Component {
    static propTypes = {
        value: PropTypes.number,
        onUpdate: PropTypes.func.isRequired
    }
    static defaultProps = {
        value: 0
    }
    getValue() {
        return this.range.value
        // return parseInt(this.range.value, 10);
    }
    render() {
        const { value, onUpdate, ...rest } = this.props;
        return [
            <form>
                <input
                    {...rest}
                    key="time"
                    ref={node => this.range = node}
                    type="time"
                    step='1'
                /></form>,
        ];
    }
}

const Table = ({ selectedTopics }) => {
    const [tableValue, setTableValue] = useState([]);
    const [Message, setMessage] = useState('');
    const username = useSelector((state) => state.Username)
    const dispatch = useDispatch()
    // setTopics()
    const columns = [{
        dataField: 'id',
        text: 'ID',
        editable: false
    }, {
        dataField: 'Link',
        text: 'Link',
        editable: false,
        style: {
            cursor: 'pointer', color: 'blue'
        },
        events: {
            onClick: (e, column, columnIndex, row, rowIndex) => {
                let url = row.link;
                window.open(url);
            }

        }
    },
    {
        dataField: 'Starting',
        text: 'Start (00hrs:00min:00sec)',
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
            <QualityRanger {...editorProps} value={value} />
        ),
        validator: (newValue, row, column) => {
            if (newValue.toString() === '00:00:00' || newValue.toString() === '00:00') {
                return {
                    valid: false,
                    message: 'Time is Empty'
                }

            }
            return true;
        }
    }, {
        dataField: 'Ending',
        text: 'End (00hrs:00min:00sec)',
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
            <QualityRanger {...editorProps} value={value} />
        )
    }];

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetch('http://localhost:3003/api/GetTopics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topics: selectedTopics,
                    tagged: '0',
                    username: username
                })

            })
            const json = await resp.json();
            if (json.success === 'Pass') {
                setTableValue(json.result)
                dispatch(ActionCountTable(json.count))
                dispatch(ActionAllTopicCount(json.alltopiccount))
                setMessage('Passed.........')
            }
            else {
                setMessage('Failed..........')
            }

        }
        fetchData();
    }, [selectedTopics])

    const onSubmitHandle = async () => {
        let checkValidation = true;
        if (tableValue.length === 0) {
            setMessage('Table Is Empty.....')
            checkValidation = false;
        }

        for (let i = 0; i < tableValue.length; i++) {
            if (tableValue[i].Starting.toString() === '00:00:00' || tableValue[i].Starting.toString() === '00:00' || tableValue[i].Ending.toString() === '00:00:00' || tableValue[i].Ending.toString() === '00:00') {
                checkValidation = false;
                document.getElementById('tableupdate').style.background = 'red';
                setMessage('starting and ending time is not filled completely please it fillout and retry again....')
                break
            }

        }
        if (checkValidation) {
            document.getElementById('tableupdate').style.background = 'green';
            const res = await fetch('http://localhost:3003/api/SetTagTopics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: tableValue

                })
            });
            const json = await res.json();
            if (json.Updated) {
                setMessage('Set_Passed.........')
                const get_topics = await fetch('http://localhost:3003/api/GetTopics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        topics: selectedTopics,
                        tagged: '0',
                        username: username
                    })

                })
                const get_json = await get_topics.json();
                if (get_json.success === 'Pass') {
                    document.getElementById('tableupdate').style.background = 'green';
                    setTableValue(get_json.result)
                    dispatch(ActionCountTable(json.count))
                    dispatch(ActionAllTopicCount(json.alltopiccount))
                    setMessage('Get_Passed.........')

                }
                else {
                    document.getElementById('tableupdate').style.background = 'red';
                    setMessage('Get_Failed..........')
                }

            }
            else {
                document.getElementById('tableupdate').style.background = 'red';
                setMessage('Set_Failed..........')
            }

        }

    }


    return (
        <React.Fragment>
            <BootstrapTable keyField='id' data={tableValue} columns={columns} cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, autoSelectText: true, })} noDataIndication="Table is Empty" />
            <Button id='tableupdate' variant='primary' className='btn main-btn float-right' size='lg' onClick={onSubmitHandle}>Submit</Button>
            <i>{Message}</i>
        </React.Fragment>
    );
}

export default Table;