import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class DeleteNow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDeleting: false
    };
  }

  deleteNow() {
    this.setState({isDeleting: true});
    this.props.win.Dofucks.Deleter.deleteThen(null, () => {
      this.setState({isDeleting: false});
    })
  }

  render() {
    return (
      <FlatButton
        label="DELETE NOW"
        primary={true}
        icon={<ActionDelete />}
        onClick={this.deleteNow.bind(this)}
        disabled={this.state.isDeleting}
        fullWidth={true}
      />
    );
  }
}

export default DeleteNow;
