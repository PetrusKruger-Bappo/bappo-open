import React from 'react';
import { Text, TextInput, View } from 'bappo-components';
import { styles as helperStyles } from '../helpers';

export default class TextEventsExample extends React.Component {
  state = {
    curText: '<No Event>',
    prevText: '<No Event>',
    prev2Text: '<No Event>',
    prev3Text: '<No Event>',
  };

  updateText = text => {
    this.setState(state => {
      return {
        curText: text,
        prevText: state.curText,
        prev2Text: state.prevText,
        prev3Text: state.prev2Text,
      };
    });
  };

  render() {
    return (
      <View>
        <TextInput
          onBlur={() => this.updateText('onBlur')}
          onFocus={() => this.updateText('onFocus')}
          onValueChange={value =>
            this.updateText(`onValueChange text: ${value}`)
          }
          placeholder="Enter text to see events"
          style={{ ...helperStyles.textinput, maxWidth: 200 }}
        />
        <Text style={styles.eventLabel}>
          {this.state.curText}
          {'\n'}
          (prev: {this.state.prevText}){'\n'}
          (prev2: {this.state.prev2Text}){'\n'}
          (prev3: {this.state.prev3Text})
        </Text>
      </View>
    );
  }
}

const styles = {
  eventLabel: {
    margin: 3,
    fontSize: 12,
  },
};
