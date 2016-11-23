/**
 * NODE JS SDK for Jingtum network；
 * @version 1.0.0
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
*/
var Base58Utils = require('./base58');
var sjcl        = require('./sjcl');

function append_int(a, i) {
    return [].concat(a, i >> 24, (i >> 16) & 0xff, (i >> 8) & 0xff, i & 0xff)
}

function firstHalfOfSHA512(bytes) {
    return sjcl.bitArray.bitSlice(
        sjcl.hash.sha512.hash(sjcl.codec.bytes.toBits(bytes)),
        0, 256
    );
}

function SHA256_RIPEMD160(bits) {
    return sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(bits));
}


function SkywellAddress(seed) {
    this.seed = Base58Utils.decode_base_check(33, seed);
    if (!this.seed) {
        throw "Invalid seed."
    }
}

SkywellAddress.prototype.getAddress = function(seq) {
    seq = seq || 0;

    var private_gen, public_gen, i = 0;
    do {
        private_gen = sjcl.bn.fromBits(firstHalfOfSHA512(append_int(this.seed, i)));
        i++;
    } while (!sjcl.ecc.curves.c256.r.greaterEquals(private_gen));

    public_gen = sjcl.ecc.curves.c256.G.mult(private_gen);

    var sec;
    i = 0;
    do {
        sec = sjcl.bn.fromBits(firstHalfOfSHA512(append_int(append_int(public_gen.toBytesCompressed(), seq), i)));
        i++;
    } while (!sjcl.ecc.curves.c256.r.greaterEquals(sec));

    var pubKey = sjcl.ecc.curves.c256.G.mult(sec).toJac().add(public_gen).toAffine();

    return Base58Utils.encode_base_check(0, sjcl.codec.bytes.fromBits(SHA256_RIPEMD160(sjcl.codec.bytes.toBits(pubKey.toBytesCompressed()))));
};

module.exports = SkywellAddress;
