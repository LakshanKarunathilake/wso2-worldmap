import { Component } from 'react';
import ChannelManager from './ChannelManager';
import DATA_SET from './DataSet/dataset.json';

export default class Widget extends Component {
  getWidgetChannelManager() {
    console.log('widget Channel Manager');
    return ChannelManager;
  }

  publish(message) {
    console.log('Published Message :', message);
  }

  subscribe(callBackFunction) {
    const DATA = ChannelManager.setUpdata();
    let x;
    let y;
    setInterval(() => {
      x = this.getRandomX(DATA.metadata);
      y = this.getRandomY(DATA.metadata);
      console.log('x :', x);
      console.log('y :', y);
      callBackFunction({
        DataSet: DATA.data,
        metadata: DATA.metadata,
        x_axis: x,
        y_axis: y,
      });
    }, 2000);
  }

  getRandomX(metadata) {
    const condition = true;
    do {
      const random = Math.floor(Math.random() * metadata.names.length);
      if (metadata.types[random] === 'ordinal') {
        console.log('ordinal');
        console.log('random x', metadata.names[random]);
        return metadata.names[random];
      }
    } while (condition);
  }

  getRandomY(metadata) {
    const condition = true;
    do {
      const random = Math.floor(Math.random() * metadata.names.length);
      if (metadata.types[random] === 'linear') {
        console.log('linear');
        console.log('random y', metadata.names[random]);
        return metadata.names[random];
      }
    } while (condition);
  }
}
