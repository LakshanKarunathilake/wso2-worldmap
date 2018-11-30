/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import DATASET from "./DataSet/dataset.json";

export default class ChannelManager {
  static subscribeWidget(widgetID, callBackFunction, configurations) {
    callBackFunction(this.setUpdata());
  }

  static setUpdata() {
    const dataSet = {
      data: [],
      metadata: {
        types: [],
        names: []
      }
    };

    dataSet.metadata.names = Object.keys(DATASET[0]);
    
    for (let index = 0; index < Object.values(DATASET[0]).length; index++) {
      if (isNaN(Object.values(DATASET[0])[index])) {
        dataSet.metadata.types.push("ordinal");
      } else {
        dataSet.metadata.types.push("linear");
      }
    }

    for (let index = 0; index < DATASET.length; index++) {
      dataSet.data.push(Object.values(DATASET[index]));
    }
    return dataSet;
  }
}
