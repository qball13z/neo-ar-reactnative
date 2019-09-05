'use strict';

import React, { Component } from 'react';
import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroConstants,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroAnimations
} from 'react-viro';

var createReactClass = require('create-react-class');

var HelloWorldSceneAR = createReactClass({
  getInitialState: function() {
    return {
      loopState:false,
      animationName:"01",
      pauseUpdates : false,
      playAnim: false,
      modelAnim: false,
      animateLogo: false,
    };
  },

  render() {
    return (
      <ViroARScene>
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0, -1, -.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
        
        <ViroARImageMarker target={"targetOne"} onAnchorFound={this._onAnchorFound} >
            <Viro3DObject
            source={require('./res/wwt.obj')}
            position={[0, 0, 0]}
            scale={[0, 0, 0]}
            rotation={[-90, 0, 0]}
            animation={{name:"scaleUp", run:this.state.playAnim}}
            type="OBJ" />
            </ViroARImageMarker>
      </ViroARScene>
    );
  },

  _onAnchorFound() {
    this.setState({
      animateLogo: true,
      playAnim: true,
    });
  },

  _onInitialized(state, reason) {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        text : "Hello World!"
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
    }
  }
});

ViroARTrackingTargets.createTargets({
  "targetOne" : {
    source : require('./res/wwt.jpg'),
    orientation : "Up",
    physicalWidth : 0.1 // real world width in meters
  },
});

ViroAnimations.registerAnimations({
  scaleUp:{properties:{scaleX:0.06, scaleY:0.06, scaleZ:0.06,},
                duration: 1500, easing: "bounce"}
});

module.exports = HelloWorldSceneAR;
