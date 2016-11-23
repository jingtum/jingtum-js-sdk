/*
 * NODE JS SDK for Jingtum network； Websocket class
 * @version 1.1.0
 * Copyright (C) 2016 by Jingtum Inc.
 * or its affiliates. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * --------------------------------------------------------
 * Error:
 * Contains the Error types and information.
*/
function Error(type, msg) {
    this.type = type;
    this.msg = msg;
}

function ParamException(msg) {
    Error.call(this, 'ParamException', msg);
}

function NetworkException(msg) {
    Error.call(this, 'NetworkException', msg);
}

function ServerException(msg) {
    Error.call(this, 'ServerException', msg);
}

exports.ParamException = ParamException;
exports.NetworkException = NetworkException;
exports.ServerException = ServerException;
