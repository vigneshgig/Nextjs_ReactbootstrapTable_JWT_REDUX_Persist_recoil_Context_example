import React, { useState } from 'react';
import NavigationPage from '../component/NavComponent';
import '../styles/topicsstyle.css';
import { Dropdown, FormControl, Button } from 'react-bootstrap';
import { Topicslist } from '../TopicsList';
import Table from '../component/TableComponent';
import { useSelector, useDispatch } from 'react-redux'

const TopicsTagPage = (props) => {
    const TopicsArray = Topicslist
    const [dropdowntopics, setDropdowntopics] = useState(TopicsArray[0]);
    const count = useSelector((state) => state.count)
    const alltopiccount_dict = useSelector((state) => state.alltopiccount)
    // The forwardRef is important!!
    // Dropdown needs access to the DOM node in order to position the Menu

    const handleSelect = (eventkey, event) => {
        setDropdowntopics(eventkey);
    }
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
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');

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
                                !value || child.props.children[0].toLowerCase().startsWith(value.toLowerCase()),
                        )}

                    </ul>
                </div>
            );
        },
    );
    return (
        <React.Fragment>
            <NavigationPage />
            <Button variant='primary' className='float-right'>{count}</Button>
            <Dropdown onSelect={handleSelect}>
                <Button id='topicsdropdown' variant='light'>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                        {dropdowntopics}
                    </Dropdown.Toggle></Button>

                <Dropdown.Menu as={CustomMenu}  >
                    {Object.keys(alltopiccount_dict).map((item, index) => (
                        <Dropdown.Item id={item} eventKey={item}>{item}     ({alltopiccount_dict[item]})</Dropdown.Item>
                    ))
                    }
                </Dropdown.Menu>
            </Dropdown>
            <Table selectedTopics={dropdowntopics} />
        </React.Fragment>);
}

export default TopicsTagPage;

TopicsTagPage.getInitialProps = async (ctx) => {
    const cookie = ctx.req?.headers.cookie;
    const resp = await fetch('http://localhost:3003/api/auth_check', {
        headers: {
            cookie: cookie
        }
    });
    if (resp.status === 401 && !ctx.req) {
        Router.replace('/')
        return {};
    }
    if (resp.status === 401 && ctx.req) {
        ctx.res?.writeHead(302, {
            Location: 'http://localhost:3003/'
        });
        ctx.res?.end();
        return;
    }
    const json = await resp.json();
    return { verification: json };

}
