import Router from "next/router";
const LogoutPage = () => {
  return <></>;
};
export default LogoutPage;
LogoutPage.getInitialProps = async (ctx) => {
  const cookie = ctx.req?.headers.cookie;
  if (!ctx.req) {
    const resp = await fetch("http://localhost:3003/api/LogOut", {
      method: "GET",
      headers: {
        cookie: cookie,
      },
    });
    if (resp.status === 200 && !ctx.req) {
      Router.replace("/");
      return {};
    }
    const json = await resp.json();
    return { logout: json.logout };
  } else {
    const resp = await fetch("http://10.101.1.245:3003/api/LogOut", {
      method: "GET",
      headers: {
        cookie: cookie,
      },
    });
    if (resp.status === 200 && ctx.req) {
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
