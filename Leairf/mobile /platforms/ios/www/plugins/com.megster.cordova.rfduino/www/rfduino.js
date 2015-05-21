cordova.define("com.megster.cordova.rfduino.rfduino", function(require, exports, module) { // (c) 2013 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global cordova */
'use strict';

module.exports = {

    discover: function (seconds, success, failure) {
        cordova.exec(success, failure, 'RFduino', 'discover', [seconds]);
    },

    list: function (success, failure) {
        cordova.exec(success, failure, 'RFduino', 'list', []);
    },

    connect: function (uuid, success, failure) {
        cordova.exec(success, failure, 'RFduino', 'connect', [uuid]);
    },

    disconnect: function (success, failure) {
        cordova.exec(success, failure, 'RFduino', 'disconnect', []);
    },

    onData: function (success, failure) {
        cordova.exec(success, failure, 'RFduino', 'onData', []);
    },

    write: function (data, success, failure) {
        
        // data should be an ArrayBuffer, but handle strings for backward compatibility
        if (typeof(data) === 'string') {
            var string = data;
            var array = new Uint8Array(string.length);
            for (var i=0, len=string.length; i<len; i++) {
                array[i] = string.charCodeAt(i);
            }
            data = array.buffer;
        }
        
        cordova.exec(success, failure, 'RFduino', 'write', [data]);
    },

    isConnected: function (success, failure) {
        cordova.exec(success, failure, 'RFduino', 'isConnected', []);
    },

    isEnabled: function (success, failure) {
        cordova.exec(success, failure, 'RFduino', 'isEnabled', []);
    }

};
});
