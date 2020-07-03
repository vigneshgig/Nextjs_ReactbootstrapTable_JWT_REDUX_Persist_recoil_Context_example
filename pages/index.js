import Head from 'next/head'
import SignInSide from '../component/LoginComponent_material';
import Router from 'next/router';
export default function Home() {
  return (
    <div>
      <Head>
        <title>GiRetail</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous" />

      </Head>
      <SignInSide>

      </SignInSide>
    </div>

  )
}
Home.getInitialProps = async (ctx) => {
  const cookie = ctx.req?.headers.cookie;
  if(!ctx.req){
    const resp = await fetch('http://220.225.104.138:3003/api/auth_check', {
    headers: {
      cookie: cookie
    }
  });
  if (resp.status === 200 && !ctx.req) {
    Router.replace('/AddTopics')
    return {};
  }
  const json = await resp.json();
  return { verification: json };

  }
  
  else{
    const resp = await fetch('http://10.101.1.245:3003/api/auth_check', {
      headers: {
        cookie: cookie
      }
    });
    if (resp.status === 200 && ctx.req) {
      ctx.res?.writeHead(302, {
        Location: 'http://220.225.104.138:3003/AddTopics'
      });
      ctx.res?.end();
      return;
    }
    const json = await resp.json();
  return { verification: json };
  }
  
}
