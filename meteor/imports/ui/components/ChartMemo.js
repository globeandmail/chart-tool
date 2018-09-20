import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { DebounceInput } from 'react-debounce-input';

export default class ChartMemo extends Component {

  constructor(props) {
    super(props);
    this.addMemo = this.addMemo.bind(this);
    this.memoChange = this.memoChange.bind(this);
    this.state = {
      memoToggled: false
    };
  }

  addMemo() {
    this.setState({ memoToggled: !this.state.memoToggled });
  }

  memoChange(event) {
    const val = event.target.value;
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
              <DebounceInput
                minLength={2}
                debounceTimeout={500}
                element='textarea'
                className='memo-field'
                placeholder=''
                onChange={this.memoChange}
                forceNotifyByEnter={false}
                value={this.props.chart.memo || ''}
              />
            </div>
            : <button className='add-memo' onClick={this.addMemo}>Add memo</button> }
        </div>
      </div>
    );
  }

}
