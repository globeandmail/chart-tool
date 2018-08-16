import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class ChartStatus extends Component {

  constructor(props) {
    super(props);
    this.addMemo = this.addMemo.bind(this);
    this.memoBlur = this.memoBlur.bind(this);
    this.state = {
      memoToggled: false
    };
  }

  addMemo() {
    this.setState({ memoToggled: !this.state.memoToggled });
  }

  memoBlur(event) {
    const val = event.target.value.trim();
    this.setState({ memoToggled: val ? true : false });
    Meteor.call('charts.update.memo', this.props.match.params._id, val, err => {
      if (err) console.log(err);
    });
  }

  render() {
    return (
      <div className='edit-box'>
        <div className='unit-edit memo'>
          { this.props.chart.memo || this.state.memoToggled ?
            <div>
              <h4>Memos and notes</h4>
              <textarea
                onBlur={this.memoBlur}
                placeholder=''
                className='memo-field'
                defaultValue={this.props.chart.memo || ''}
              ></textarea>
            </div>
            : <button className='add-memo' onClick={this.addMemo}>Add memo</button> }
        </div>
      </div>
    );
  }

}
