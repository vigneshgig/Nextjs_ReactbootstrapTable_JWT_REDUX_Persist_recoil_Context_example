const { default: NavigationPage } = require("./NavComponent")
const Layout = (props) => {
    return (
        <div>
            <NavigationPage>{props.children}</NavigationPage>
        </div>);
}

export default Layout;