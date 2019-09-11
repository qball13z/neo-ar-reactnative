'use strict';

import React, { Component } from 'react';

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
      currentAnim:"scaleUp",
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
              source={require('./res/wwt_logo/wwt.vrx')}
              position={[0, 0, 0]}
              scale={[0, 0, 0]}
              rotation={[0, 0, 0]}
              lightReceivingBitMask={3}
              shadowCastingBitMask={2}
              animation={{name:this.state.currentAnim, run:this.state.playAnim, loop: this.state.animateLogo}}
              onClick={this._switchAnimation}
              highAccuracyEvents={true}
              type="VRX" />
            </ViroARImageMarker>
      </ViroARScene>
    );
  },

  _onAnchorFound() {
    console.log("######## FOUND ANCHOR! ");
    this.setState({
      animateLogo: false,
      playAnim: true,
      currentAnim: "scaleUp"
    });
  },

  _switchAnimation() {
    if(this.state.currentAnim == "scaleUp") {
      this.setState({
        playAnim: true,
        currentAnim: "rotate",
        animateLogo: true
      });
    } else {
      this.setState({
        playAnim: !this.state.playAnim,
      });
    }
 },   

  _onAnimationFinished(){
    ViroAnimations.registerAnimations({
      rotate:{properties:{rotateZ:"+=45"}, duration: 3000, easing: "bounce"},
      scaleUp:{properties:{positionY: "+=0.3", scaleX:0.01, scaleY:0.01, scaleZ:0.01, rotateX:"+=90"}, duration: 3000, easing: "bounce"},
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

export function createImageTarget(name, source_uri) {
  let targetName = name;
  let targets= {};
  targets[targetName] = {
    source: source_uri,
    orientation: "Up",
   physicalWidth: 5,
  }

  ViroARTrackingTargets.createTargets(targets);
}

ViroARTrackingTargets.createTargets({
  "targetOne" : {
    source : require('./res/wwt.jpg'),
    orientation : "Up",
    physicalWidth : 0.1 // real world width in meters
  },
});

ViroAnimations.registerAnimations({
  scaleUp:{properties:{positionY: "+=0.3", scaleX:0.01, scaleY:0.01, scaleZ:0.01, rotateX:"+=90"}, duration: 3000, easing: "bounce"},
  rotate:{properties:{rotateY:"+=360"}, duration:2000},
});

module.exports = HelloWorldSceneAR;
