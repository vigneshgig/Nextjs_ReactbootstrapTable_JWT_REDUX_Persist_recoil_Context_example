import React, { useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Nav, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { ActionCurrentUser } from '../store';
// import { useRecoilState } from "recoil";
// import { loggedInUserData } from "../lib/recoil-atoms";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { useStateUser, useDispatchUser } from '../lib/UserContext';
const NavigationPage = () => {
    // const username = useStateUser();
    // const dispatch = useDispatchUser();
    // const [user, setUser] = useRecoilState(loggedInUserData)
    // const dispatchUserInformation = (user) => dispatch({
    //     type: 'AddUser',
    //     payload: user
    // })
    // useEffect(() => {
    //     const data = localStorage.getItem('unknown-list')
    //     if (data) {
    //         setUser(JSON.parse(data));
    //     }
    // })
    // localStorage.setItem('unknown-list', JSON.stringify(user))
    const username = useSelector((state) => state.Username)
    return (
        <React.Fragment>
            <Navbar bg="dark" variant="dark">
                <Link href='/' passHref prefetch>
                    <Navbar.Brand>Armsofttech</Navbar.Brand>
                </Link>
                <Nav className="mr-auto">
                    <Link href='/AddTopics' passHref prefetch>
                        <Nav.Link>ADD_LINK</Nav.Link>
                    </Link>
                    <Link href="/TopicsTag" passHref prefetch>
                        <Nav.Link >Tagging</Nav.Link>
                    </Link>

                    <Link href="/AdminPage" passHref prefetch>
                        <Nav.Link >AdminPage</Nav.Link>
                    </Link>
                    <Link href='/ReportPage_1' passHref prefetch>
                        <Nav.Link>{username == 'admin' ? 'DateWiseReport' : 'DateWiseReport-Unauthorised'}</Nav.Link>
                    </Link>
                    <Link href="/TotalReportPage" passHref prefetch>
                        <Nav.Link >{username == 'admin' ? 'TotalReport' : 'TotalReport-Unauthorised'}</Nav.Link>
                    </Link>
                    <Link href="/Logout" passHref prefetch>
                        <Nav.Link >Logout</Nav.Link>
                    </Link>

                </Nav>
                <Nav>
                    <FontAwesomeIcon icon={faUserCircle} size='lg' color='white' />
                    <span ><i style={{ color: '#ffff', margin: '5px' }}>{username}</i></span>
                </Nav>
            </Navbar>
        </React.Fragment>
    )
}

export default NavigationPage;