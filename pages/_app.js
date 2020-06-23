import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import { config } from '@fortawesome/fontawesome-svg-core'
import { useStore } from '../store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


// import { UserProvider } from '../lib/UserContext';
// import { RecoilRoot } from "recoil";
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

export default function MyApp(props) {
    const { Component, pageProps } = props;
    const store = useStore(pageProps.initialReduxState)
    const persistor = persistStore(store)

    // const [user, setUser] = useState('User Name')
    // const providerUser = useMemo(() => ({ user, setUser }), [user, setUser]);
    React.useEffect(() => {
        // Remove the server-side injected CSS.

        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
    // const { RecoilPersist, updateState } = recoilPersist(
    //     ['loggedInUserData'], // configurate that atoms will be stored (if empty then all atoms will be stored),
    //     {
    //         key: 'recoil-persist', // this key is using to store data in local storage
    //         storage: localStorage // configurate which stroage will be used to store the data
    //     }
    // )

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {/* <UserProvider> */}
                {/* <RecoilRoot> */}
                <Provider store={store}>
                    <PersistGate loading={<Component {...pageProps} />} persistor={persistor}>

                        <Component {...pageProps} />
                    </PersistGate>

                </Provider>

                {/* </RecoilRoot> */}

                {/* </UserProvider> */}

            </ThemeProvider>
        </React.Fragment>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};