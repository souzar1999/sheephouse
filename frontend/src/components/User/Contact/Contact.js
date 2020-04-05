import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import GetAppIcon from "@material-ui/icons/GetApp";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  person: (props) => ({
    [theme.breakpoints.up("xs")]: {
      margin: "auto",
      padding: "20px 60px",
      borderBottom: "1px solid #555",
    },
  }),
  whats: {
    color: "green",
    fontSize: "2em",
  },
  link: {
    textDecoration: "none",
  },
  manualItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease 0.1s",
    borderRadius: 45,
    cursor: "pointer",
    color: "black",
    "&:hover": {
      boxShadow: "0px 12px 20px rgba(0,0,0, 0.2)",
      transform: "translateY(-4px)",
    },
  },
}));

function Contact() {
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <h1>Contato</h1>
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
                href="mailto:sheeephouse@gmail.com"
              >
                sheeephouse@gmail.com
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
        <div>
          <h1>Manuais</h1>
          <div style={{ textAlign: "left" }}>
            <a
              className={classes.link}
              target="_blank"
              href="./assets/termos-de-uso-sheephouse.pdf"
            >
              <p className={classes.manualItem}>
                <h4>Manual da Plataforma</h4>
                <GetAppIcon />
              </p>
            </a>
            <a
              className={classes.link}
              target="_blank"
              href="./assets/termos-de-uso-sheephouse.pdf"
            >
              <p className={classes.manualItem}>
                <h4>Manual de Organização para Proprietários</h4>
                <GetAppIcon />
              </p>
            </a>
            <a
              className={classes.link}
              target="_blank"
              href="./assets/termos-de-uso-sheephouse.pdf"
            >
              <p className={classes.manualItem}>
                <h4>Termos de Uso da Plataforma</h4>
                <GetAppIcon />
              </p>
            </a>
          </div>
        </div>
      </Paper>
    </Paper>
  );
}

export default Contact;
