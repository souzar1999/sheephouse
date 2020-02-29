import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  person: props => ({
    [theme.breakpoints.up("xs")]: {
      margin: "auto",
      padding: "20px 60px"
    }
  }),
  whats: {
    color: "green",
    fontSize: "2em"
  },
  link: {
    textDecoration: "none"
  }
}));

function Contact() {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <h1>Entre em contato conosco</h1>
      <Paper elevation={0} className={classes.paper}>
        <div className={classes.person}>
          <h2>Felipe Carneiro</h2>
          <p>
            Envie e-mail para
            <br />
            <strong>
              <a
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
                href="mailto:sheeephouse@gmail.com.br"
              >
                sheeephouse@gmail.com.br
              </a>
            </strong>
          </p>
          <p>
            <WhatsAppIcon className={classes.whats} />
            <br />
            <strong>
              <a
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
                href="https://api.whatsapp.com/send?phone=5541999676475"
              >
                Entre em contato via WhatsApp aqui
              </a>
            </strong>
          </p>
          <p>
            Ou ligue no número{" "}
            <strong>
              <a
                className={classes.link}
                target="_blank"
                rel="noopener noreferrer"
                href="tel:+5541999676475"
              >
                (41) 99967-6475
              </a>
            </strong>
          </p>
        </div>
      </Paper>
    </Paper>
  );
}

export default Contact;
