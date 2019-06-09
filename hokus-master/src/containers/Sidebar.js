//@flow

import React from 'react';
import { Route } from 'react-router-dom'
import {List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconActionList from 'material-ui/svg-icons/action/list';
import IconActionSetting from 'material-ui/svg-icons/action/settings';
import IconPlay from 'material-ui/svg-icons/av/play-arrow';
import IconLockMenu from 'material-ui/svg-icons/action/lock-outline';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
import IconMore from 'material-ui/svg-icons/navigation/more-vert';
import IconFileFolder from 'material-ui/svg-icons/file/folder';
import Border from './../components/Border';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { FlatButton, IconButton } from 'material-ui';

const Fragment = React.Fragment;
const translucentColor = 'RGBA(255,255,255,.2)';
const translucentColorSubtle = 'RGBA(255,255,255,.05)';

let MenuBorder = ({ children }) => {
  return <Border style={{margin: '0 16px', borderRadius:3, padding: '1px', borderColor:translucentColor}}>
    {children}
  </Border>;
}

let WhiteSubHeader = ({children}) => {
  return <Subheader style={{color: 'white', fontWeight:300}}>{children}</Subheader>
};


export type SidebarMenu = {
    title: string,
    key?: string,
    widget?: any,
    items?: Array<{
        active: bool,
        label: string,
        onClick: ()=>void
    }>
}

export type SidebarProps = {
    menus: Array<SidebarMenu>,
    menuIsLocked: bool,
    onLockMenuClicked: ()=> void,
    onToggleItemVisibility: ()=> void,
    hideItems : bool
}

type SidebarState = {
  
}

export class Sidebar extends React.Component<SidebarProps,SidebarState>{

  constructor(props : SidebarProps){
    super(props);
    this.state = {
      site: null,
      workspace: null
    };
  }

    render(){
        let { hideItems, menus, menuIsLocked, onToggleItemVisibility } = this.props;
        let menusNodes = menus.map((menu)=>{
        return (
            <Fragment key={menu.key||menu.title}>
                <WhiteSubHeader>{ menu.title }</WhiteSubHeader>
                { menu.widget ? (menu.widget) : (null) }
                { menu.items ? (<MenuBorder>
                    <List style={{padding: 0}}>
                        { menu.items.map((item, index)=>{
                            let style = item.active ? {background: translucentColorSubtle}:{};
                            return (
                                <ListItem
                                    key={index}
                                    innerDivStyle={style}
                                    onClick={item.onClick}
                                    primaryText={item.label}
                                    leftIcon={<IconActionList color={translucentColor} />}
                                />
                            );
                        }) }
                    </List >
                </MenuBorder>) : (null) }
            </Fragment>
        );
    });

    return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <React.Fragment>
                <div className={'slideFadeInRight animated'}  style={{position:'relative', opacity: 1}}>
                    
                    <IconMenu style={{ position: 'absolute', right: '21px', top:'15px' }} />

                    <FlatButton
                    style={Object.assign({}, 
                        { height:'calc(100vh - 42px)',width:'100%', position:'absolute'},
                        { transition: menuIsLocked? undefined: 'opacity 1s linear' },
                        hideItems? { opacity:1 } : { opacity:0, pointerEvents:'none' }
                    )}
                    label=" " onClick={()=>{onToggleItemVisibility()}}/>
                    
                    <div style={ Object.assign({},
                        { width:'280px', transition: 'all .2s' },
                        hideItems? { opacity:0, pointerEvents:'none' } : { opacity:1 }
                    )}>
        
                        <IconButton
                            onClick={()=>this.props.onLockMenuClicked()}
                            style={{ position: 'absolute', right: '48px', top:'3px' }}
                            iconStyle={{opacity: (menuIsLocked?'1':'.2')  }}>
                            <IconLockMenu />}
                        </IconButton>
        
                        { menusNodes }

                        <br />
                    </div>
                </div>
            </React.Fragment>
        </MuiThemeProvider>
    );
  }
}