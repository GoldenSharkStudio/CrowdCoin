import React from "react";
import {Menu, Icon, Input} from "semantic-ui-react";
import {Link} from '../routes';

const MenuBar = () => {
  return (
      <Menu style={{marginTop: '10px'}}>
          <Link route="/">
              <a className="item">CrowdCoin</a>
          </Link>
          <Menu.Item style={{flexGrow: 2}}>
              <Input icon="search" placeholder="Search Campaigns"/>
          </Menu.Item>
          <Menu.Menu position="right">
              <Link route="/">
                  <a className="item">
                      <Icon name="list"/> Campaigns
                  </a>
              </Link>
              <Link route="/campaigns/new">
                  <a className="item"><Icon name="plus"/></a>
              </Link>
          </Menu.Menu>
      </Menu>
  );
};

export default MenuBar;