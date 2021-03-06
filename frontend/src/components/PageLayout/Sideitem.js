import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { closeMenu } from "../../store/actions";

const useStyles = makeStyles({
  list: {
    width: 250,
    color: "#fff",
  },
  listIcon: {
    color: "#fff",
  },
});

function ListItemLink(props: ListItemProps<"a", { button?: true }>) {
  return <ListItem button component={Link} {...props} />;
}

const Sideitem = ({ onCloseMenu, label, link, icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.list} role="presentation" onClick={onCloseMenu}>
      <List>
        <ListItemLink to={link}>
          <ListItemIcon>
            <Icon className={classes.listIcon}>{icon}</Icon>
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemLink>
      </List>
    </div>
  );
};

const mapDispatchToProps = {
  onCloseMenu: closeMenu,
};

export default connect(null, mapDispatchToProps)(Sideitem);
