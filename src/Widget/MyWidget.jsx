import React from "react";
import PropTypes from "prop-types";
//Stylings
import "../css/PreLoader.css";
import "../css/Message.css";
import "../css/Selector.css";
//Widget configuration source
import widgetConf from "../../resources/widgetConf.json";
import VizG from "react-vizgrammar";
import { Card, CardContent, CardHeader } from "@material-ui/core/";
import { dark, light } from "../Theme/Theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
/**
 * For the production build compatible for working on dashboard portal uncomment the line #17 and comment the line #19
 */

// import Widget from "@wso2-dashboards/widget";
import Widget from "../../Mocking/Widget";

export class MyWidget extends Widget {
  state = {
    hasInfo: true,
    loading: true,
    metadata: {},
    DataSet: [],
    hasError: false,
    errorMsg: "",
    theme: dark,
    height:"100%",
    width:"100%"
  };

  componentWillMount() {
    console.log("this.props :", this.props);
    if (this.props.muiTheme) {
      this.state.theme = this.props.muiTheme.name === "dark" ? dark : light;
    }

    
  }

  /**
   * Obtain the Channel Manager via the Widget and passing the data to the relevant Widget in the golden layout.
   */

  componentDidMount() {
    try {
      if (this.state.loading) {
        const dataProviderConf = widgetConf.configs.providerConfig;
        super
          .getWidgetChannelManager()
          .subscribeWidget(
            this.props.id || "dummyID",
            this.formatDataToVizGrammar,
            dataProviderConf
          );
      }
    } catch (error) {
      console.error("Error :", error.message);
      this.setState({
        errorMsg:
          "Error in @wso2-dashboard component call please review the segment and retry...",
        hasError: true
      });
    }
  }

  componentWillReceiveProps() {
    if (this.props.muiTheme) {
      this.state.theme = this.props.muiTheme.name === "dark" ? light : dark;
    }
    if (this.props.glContainer != undefined) {
      this.setState({
        width: this.props.glContainer.width,
        height: this.props.glContainer.height
      });
    }
  }

  renderErrorMessage = () => {
    if (this.state.hasError === true)
      return (
        <div className="error message">
          <h2>Error</h2>
          <p>{this.state.errorMsg}</p>
        </div>
      );
  };

  renderBarChart = () => {
    console.log("renderig bar chart");
    return (
      <div style={{ height: this.state.height, width: this.state.width, marginTop: "10px" }}>
        <Card>
          <CardHeader
            title={"SurfaceArea dissemination of World"}
            subheader={
              "This map represent the surface area dissemination in the world"
            }
          />
          <CardContent>
            <VizG
              config={{
                x: widgetConf.chartConfigs.x_axis,
                charts: [
                  {
                    type: "map",
                    y: widgetConf.chartConfigs.y_axis,
                    mapType: "world",
                    colorScale: ["#1565C0", "#4DB6AC"]
                  }
                ],
                chloropethRangeUpperbound: [10000000],
                chloropethRangeLowerbound: [0]
              }}
              metadata={this.state.metadata}
              data={this.state.DataSet}
              theme={this.state.theme === dark ? "dark" : "light"}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  formatDataToVizGrammar = stats => {
    console.log("stats", stats);
    if (stats.metadata != undefined) {
      const metaName_arr = [];
      const metaType_arr = [];
      let checkBoxStatus = {};
      stats.metadata.names.map((el, i) => {
        metaName_arr.push(el);
        if (stats.metadata.types[i] === "linear") {
          checkBoxStatus = Object.assign({ [el]: false }, checkBoxStatus);
        }
      });
      stats.metadata.types.map(el => {
        metaType_arr.push(el.toLowerCase());
      });
      const metaVals = { ...this.state.metadata };
      metaVals.names = metaName_arr;
      metaVals.types = metaType_arr;

      this.setState({
        loading: false,
        metadata: metaVals,
        DataSet: stats.data
      });
    }
  };

  renderNotes = () => {
    return (
      <ul>
        <li>This map represent the surface area dissemination in the world</li>
      </ul>
    );
  };

  /**
   * Rendering the pre Loading view
   *
   * @returns {PreLoader}
   */
  renderPreLoader = () => {
    return (
      <div className={"outer-div"}>
        <div className={"center-div"}>
          <div className={"inner-div"}>
            <div>
              <h2>Loading Data....</h2>
              <div className={"psoload"}>
                <div className={"straight"} />
                <div className={"curve"} />
                <div className={"center"} />
                <div className={"inner"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    console.log("subscriber states", this.state);
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <div>
          {this.renderErrorMessage()}
          {this.state.loading ? this.renderPreLoader() : this.renderBarChart()}
        </div>
      </MuiThemeProvider>
    );
  }
}

// Verifying that the dashboard availability to register the widget in the portal
if (global.dashboard != undefined) {
  global.dashboard.registerWidget(widgetConf.name, MyWidget);
}
