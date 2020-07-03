import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="email:vig   neshgig@gmail.com">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUpSide() {
  const classes = useStyles();
  const [Username, setUsername] = useState(null);
  const [Password, setPassword] = useState(null);
  const [Message, setMessage] = useState("Empty");
  const [Iserror, setIserror] = useState(false);
  const IsEmpty = () => {
    if (Password && Username) {
      setIserror(false);
      setMessage("");
    } else {
      setIserror(true);
      setMessage("Field Is Empty");
    }
  };
  useEffect(() => {
    IsEmpty();
  }, [Username, Password]);
  const onSubmit = async (event) => {
    const resp = await fetch("http://localhost:3003/api/SignUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: Username,
        password: Password,
      }),
    });

    const json = await resp.json();
    console.log(json, ">>>>>>>>>>>>>>>>>>>>>>");
    if (json.Created === "True") {
      alert(`Username ADDED=>${json.username}`);
      // // setUser({ username: json.username })
      // dispatch(ActionCurrentUser(json.username))
      // Router.replace('/AddTopics')
    } else {
      alert(`Username Failed To ADD=>${json.username}`);
      setIserror(true);
      setMessage(json.message);
      event.preventDefault();
    }
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ADD USER
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="UserName"
              name="username"
              InputLabelProps={{
                shrink: true,
                error: Iserror,
              }}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              helperText={Message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              InputLabelProps={{
                shrink: true,
                error: Iserror,
              }}
              onChange={(e) => setPassword(e.target.value)}
              helperText={Message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              Submit
            </Button>

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

// SignUpSide.getInitialProps = async (ctx) => {
//     const cookie = ctx.req?.headers.cookie;
//     if(!ctx.req) {
//         const resp = await fetch('http://localhost:3003/api/auth_check_admin', {
//             headers: {
//                 cookie: cookie
//             }
//         });
//         if (resp.status === 401 && !ctx.req) {
//             Router.replace('/')
//             return {};
//         }
//         const json = await resp.json();
//         return { verification: json };

//     }
//     else {
//         const resp = await fetch('http://10.101.1.245:3003/api/auth_check_admin', {
//             headers: {
//                 cookie: cookie
//             }
//         });
//         if (resp.status === 401 && ctx.req) {
//             ctx.res?.writeHead(302, {
//                 Location: 'http://localhost:3003/'
//             });
//             ctx.res?.end();
//             return;
//         }

//         const json = await resp.json();
//         return { verification: json };
//     }

// }
