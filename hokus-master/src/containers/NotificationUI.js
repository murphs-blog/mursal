import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { consoleService, snackMessageService } from '../services/ui-service';
import ConsoleIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

const consoleStyle ={
  toggleWrapper:{
    position:'fixed',
    right:0,
    top:70,
    zIndex:2,
    padding: '15px 0px 15px 15px',
    display:'block'
  },
  toggle:{
    display:'block',
    background: '#1E1729',
    width:'20px',
    height: '40px',
    borderRadius: '5px 0 0 5px'
  },
  pre: {
    position:'fixed',
    right:'0',
    top:'42px',
    padding:'10px 10px 100px 10px',
    overflow:'auto',
    margin:'0',
    width:'20%',
    minWidth:'400px',
    lineHeight:'1.4',
    height:'calc(100% - 42px)',
    fontFamily:'monospace',
    fontWeight:'bold',
    background:'#1E1729',
    color:'#d4d4d4',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    zIndex:3
  }
}

class ConsoleOutput extends React.Component{
  constructor(props){
    super(props);
    this.closeTimeout = undefined;
  }
  componentWillMount(){
    consoleService.registerListener(this);
  }

  componentWillUnmount(){
    consoleService.unregisterListener(this);
  }

  handleMouseEnter(e){
    if(this.closeTimeout)
      clearTimeout(this.closeTimeout);
      
    if(consoleService.getConsoleIsHidden()){
      consoleService.toggleConsoleVisibility();
    }
  }
  
  handleMouseLeave(e){
    if(this.closeTimeout)
      clearTimeout(this.closeTimeout);
    
      this.closeTimeout = setTimeout(()=>{
        if(!consoleService.getConsoleIsHidden()){
          consoleService.toggleConsoleVisibility();
        }    
      }, 10);
  }
  
  render(){

    let visible = !consoleService.getConsoleIsHidden();
    let preStyle = Object.assign({}, consoleStyle.pre, visible?undefined:{display:'none'});

    if(this.preElement){
      this.preElement.scrollTop = 5000;
    }

    return <React.Fragment>
      <a
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        style={consoleStyle.toggleWrapper}><span style={consoleStyle.toggle}><ConsoleIcon style={{color:'#d4d4d4', marginTop:8}} /></span></a>
      <pre
        className={ visible?"slideInRight animated-fast":"" }
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        style={preStyle}
        ref={ (pre) => this.preElement = pre }
      >
      { consoleService.getConsoleMessages().map(({key, line}) => line).join('\n') }
    </pre>
    </React.Fragment>;
  }
}

class SnackbarManager extends React.Component{
  
  componentWillMount(){
    snackMessageService.registerListener(this);
  }

  componentWillUnmount(){
    snackMessageService.unregisterListener(this);
  }
  
  render(){
    let snackMessage = snackMessageService.getCurrentSnackMessage();
    let previousSnackMessage = snackMessageService.getPreviousSnackMessage();
    let snackbar = undefined;
    if(snackMessage){
      snackbar = <Snackbar
        key="snack-message"
        open={ true }
        action={ snackMessage.action }
        onActionClick={ snackMessage.onActionClick }
        message={ snackMessage.message }
        autoHideDuration={ snackMessage.autoHideDuration }
        onRequestClose={ function(){
          snackMessageService.reportSnackDismiss()
        }}
      />;
    }
    else{
      snackbar = <Snackbar
        key="snack-message"
        open={ false }
        action={ previousSnackMessage?previousSnackMessage.action:'' }
        message={ previousSnackMessage?previousSnackMessage.message:'' }
      />;
    }

    return <React.Fragment>
      {snackbar}
    </React.Fragment>;
  }
}

class NotificationUI extends React.Component{
    
  render(){
      return (<React.Fragment>
        <SnackbarManager />
        <ConsoleOutput />
      </React.Fragment>);
    }
  }

  export default NotificationUI;