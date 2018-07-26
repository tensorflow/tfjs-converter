/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var aspromise = asPromise;

/**
 * Callback as used by {@link util.asPromise}.
 * @typedef asPromiseCallback
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {...*} params Additional arguments
 * @returns {undefined}
 */

/**
 * Returns a promise from a node-style callback function.
 * @memberof util
 * @param {asPromiseCallback} fn Function to call
 * @param {*} ctx Function context
 * @param {...*} params Function arguments
 * @returns {Promise<*>} Promisified function
 */
function asPromise(fn, ctx/*, varargs */) {
    var params  = new Array(arguments.length - 1),
        offset  = 0,
        index   = 2,
        pending = true;
    while (index < arguments.length)
        params[offset++] = arguments[index++];
    return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err/*, varargs */) {
            if (pending) {
                pending = false;
                if (err)
                    reject(err);
                else {
                    var params = new Array(arguments.length - 1),
                        offset = 0;
                    while (offset < params.length)
                        params[offset++] = arguments[offset];
                    resolve.apply(null, params);
                }
            }
        };
        try {
            fn.apply(ctx || null, params);
        } catch (err) {
            if (pending) {
                pending = false;
                reject(err);
            }
        }
    });
}

var base64_1 = createCommonjsModule(function (module, exports) {

/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};
});

var eventemitter = EventEmitter;

/**
 * Constructs a new event emitter instance.
 * @classdesc A minimal event emitter.
 * @memberof util
 * @constructor
 */
function EventEmitter() {

    /**
     * Registered listeners.
     * @type {Object.<string,*>}
     * @private
     */
    this._listeners = {};
}

/**
 * Registers an event listener.
 * @param {string} evt Event name
 * @param {function} fn Listener
 * @param {*} [ctx] Listener context
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.on = function on(evt, fn, ctx) {
    (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn  : fn,
        ctx : ctx || this
    });
    return this;
};

/**
 * Removes an event listener or any matching listeners if arguments are omitted.
 * @param {string} [evt] Event name. Removes all listeners if omitted.
 * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.off = function off(evt, fn) {
    if (evt === undefined)
        this._listeners = {};
    else {
        if (fn === undefined)
            this._listeners[evt] = [];
        else {
            var listeners = this._listeners[evt];
            for (var i = 0; i < listeners.length;)
                if (listeners[i].fn === fn)
                    listeners.splice(i, 1);
                else
                    ++i;
        }
    }
    return this;
};

/**
 * Emits an event by calling its listeners with the specified arguments.
 * @param {string} evt Event name
 * @param {...*} args Arguments
 * @returns {util.EventEmitter} `this`
 */
EventEmitter.prototype.emit = function emit(evt) {
    var listeners = this._listeners[evt];
    if (listeners) {
        var args = [],
            i = 1;
        for (; i < arguments.length;)
            args.push(arguments[i++]);
        for (i = 0; i < listeners.length;)
            listeners[i].fn.apply(listeners[i++].ctx, args);
    }
    return this;
};

var float_1 = factory(factory);

/**
 * Reads / writes floats / doubles from / to buffers.
 * @name util.float
 * @namespace
 */

/**
 * Writes a 32 bit float to a buffer using little endian byte order.
 * @name util.float.writeFloatLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 32 bit float to a buffer using big endian byte order.
 * @name util.float.writeFloatBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 32 bit float from a buffer using little endian byte order.
 * @name util.float.readFloatLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 32 bit float from a buffer using big endian byte order.
 * @name util.float.readFloatBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Writes a 64 bit double to a buffer using little endian byte order.
 * @name util.float.writeDoubleLE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Writes a 64 bit double to a buffer using big endian byte order.
 * @name util.float.writeDoubleBE
 * @function
 * @param {number} val Value to write
 * @param {Uint8Array} buf Target buffer
 * @param {number} pos Target buffer offset
 * @returns {undefined}
 */

/**
 * Reads a 64 bit double from a buffer using little endian byte order.
 * @name util.float.readDoubleLE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

/**
 * Reads a 64 bit double from a buffer using big endian byte order.
 * @name util.float.readDoubleBE
 * @function
 * @param {Uint8Array} buf Source buffer
 * @param {number} pos Source buffer offset
 * @returns {number} Value read
 */

// Factory function for the purpose of node-based testing in modified global environments
function factory(exports) {

    // float: typed array
    if (typeof Float32Array !== "undefined") (function() {

        var f32 = new Float32Array([ -0 ]),
            f8b = new Uint8Array(f32.buffer),
            le  = f8b[3] === 128;

        function writeFloat_f32_cpy(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
        }

        function writeFloat_f32_rev(val, buf, pos) {
            f32[0] = val;
            buf[pos    ] = f8b[3];
            buf[pos + 1] = f8b[2];
            buf[pos + 2] = f8b[1];
            buf[pos + 3] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        /* istanbul ignore next */
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

        function readFloat_f32_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            return f32[0];
        }

        function readFloat_f32_rev(buf, pos) {
            f8b[3] = buf[pos    ];
            f8b[2] = buf[pos + 1];
            f8b[1] = buf[pos + 2];
            f8b[0] = buf[pos + 3];
            return f32[0];
        }

        /* istanbul ignore next */
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        /* istanbul ignore next */
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

    // float: ieee754
    })(); else (function() {

        function writeFloat_ieee754(writeUint, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0)
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
            else if (isNaN(val))
                writeUint(2143289344, buf, pos);
            else if (val > 3.4028234663852886e+38) // +-Infinity
                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
            else if (val < 1.1754943508222875e-38) // denormal
                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
            else {
                var exponent = Math.floor(Math.log(val) / Math.LN2),
                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
            }
        }

        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

        function readFloat_ieee754(readUint, buf, pos) {
            var uint = readUint(buf, pos),
                sign = (uint >> 31) * 2 + 1,
                exponent = uint >>> 23 & 255,
                mantissa = uint & 8388607;
            return exponent === 255
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 1.401298464324817e-45 * mantissa
                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }

        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

    })();

    // double: typed array
    if (typeof Float64Array !== "undefined") (function() {

        var f64 = new Float64Array([-0]),
            f8b = new Uint8Array(f64.buffer),
            le  = f8b[7] === 128;

        function writeDouble_f64_cpy(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[0];
            buf[pos + 1] = f8b[1];
            buf[pos + 2] = f8b[2];
            buf[pos + 3] = f8b[3];
            buf[pos + 4] = f8b[4];
            buf[pos + 5] = f8b[5];
            buf[pos + 6] = f8b[6];
            buf[pos + 7] = f8b[7];
        }

        function writeDouble_f64_rev(val, buf, pos) {
            f64[0] = val;
            buf[pos    ] = f8b[7];
            buf[pos + 1] = f8b[6];
            buf[pos + 2] = f8b[5];
            buf[pos + 3] = f8b[4];
            buf[pos + 4] = f8b[3];
            buf[pos + 5] = f8b[2];
            buf[pos + 6] = f8b[1];
            buf[pos + 7] = f8b[0];
        }

        /* istanbul ignore next */
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        /* istanbul ignore next */
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

        function readDouble_f64_cpy(buf, pos) {
            f8b[0] = buf[pos    ];
            f8b[1] = buf[pos + 1];
            f8b[2] = buf[pos + 2];
            f8b[3] = buf[pos + 3];
            f8b[4] = buf[pos + 4];
            f8b[5] = buf[pos + 5];
            f8b[6] = buf[pos + 6];
            f8b[7] = buf[pos + 7];
            return f64[0];
        }

        function readDouble_f64_rev(buf, pos) {
            f8b[7] = buf[pos    ];
            f8b[6] = buf[pos + 1];
            f8b[5] = buf[pos + 2];
            f8b[4] = buf[pos + 3];
            f8b[3] = buf[pos + 4];
            f8b[2] = buf[pos + 5];
            f8b[1] = buf[pos + 6];
            f8b[0] = buf[pos + 7];
            return f64[0];
        }

        /* istanbul ignore next */
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        /* istanbul ignore next */
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

    // double: ieee754
    })(); else (function() {

        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
            var sign = val < 0 ? 1 : 0;
            if (sign)
                val = -val;
            if (val === 0) {
                writeUint(0, buf, pos + off0);
                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
            } else if (isNaN(val)) {
                writeUint(0, buf, pos + off0);
                writeUint(2146959360, buf, pos + off1);
            } else if (val > 1.7976931348623157e+308) { // +-Infinity
                writeUint(0, buf, pos + off0);
                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
            } else {
                var mantissa;
                if (val < 2.2250738585072014e-308) { // denormal
                    mantissa = val / 5e-324;
                    writeUint(mantissa >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                } else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2);
                    if (exponent === 1024)
                        exponent = 1023;
                    mantissa = val * Math.pow(2, -exponent);
                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                }
            }
        }

        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
            var lo = readUint(buf, pos + off0),
                hi = readUint(buf, pos + off1);
            var sign = (hi >> 31) * 2 + 1,
                exponent = hi >>> 20 & 2047,
                mantissa = 4294967296 * (hi & 1048575) + lo;
            return exponent === 2047
                ? mantissa
                ? NaN
                : sign * Infinity
                : exponent === 0 // denormal
                ? sign * 5e-324 * mantissa
                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }

        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

    })();

    return exports;
}

// uint helpers

function writeUintLE(val, buf, pos) {
    buf[pos    ] =  val        & 255;
    buf[pos + 1] =  val >>> 8  & 255;
    buf[pos + 2] =  val >>> 16 & 255;
    buf[pos + 3] =  val >>> 24;
}

function writeUintBE(val, buf, pos) {
    buf[pos    ] =  val >>> 24;
    buf[pos + 1] =  val >>> 16 & 255;
    buf[pos + 2] =  val >>> 8  & 255;
    buf[pos + 3] =  val        & 255;
}

function readUintLE(buf, pos) {
    return (buf[pos    ]
          | buf[pos + 1] << 8
          | buf[pos + 2] << 16
          | buf[pos + 3] << 24) >>> 0;
}

function readUintBE(buf, pos) {
    return (buf[pos    ] << 24
          | buf[pos + 1] << 16
          | buf[pos + 2] << 8
          | buf[pos + 3]) >>> 0;
}

var inquire_1 = inquire;

/**
 * Requires a module only if available.
 * @memberof util
 * @param {string} moduleName Module to require
 * @returns {?Object} Required module if available and not empty, otherwise `null`
 */
function inquire(moduleName) {
    try {
        var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
        if (mod && (mod.length || Object.keys(mod).length))
            return mod;
    } catch (e) {} // eslint-disable-line no-empty
    return null;
}

var utf8_1 = createCommonjsModule(function (module, exports) {

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};
});

var pool_1 = pool;

/**
 * An allocator as used by {@link util.pool}.
 * @typedef PoolAllocator
 * @type {function}
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */

/**
 * A slicer as used by {@link util.pool}.
 * @typedef PoolSlicer
 * @type {function}
 * @param {number} start Start offset
 * @param {number} end End offset
 * @returns {Uint8Array} Buffer slice
 * @this {Uint8Array}
 */

/**
 * A general purpose buffer pool.
 * @memberof util
 * @function
 * @param {PoolAllocator} alloc Allocator
 * @param {PoolSlicer} slice Slicer
 * @param {number} [size=8192] Slab size
 * @returns {PoolAllocator} Pooled allocator
 */
function pool(alloc, slice, size) {
    var SIZE   = size || 8192;
    var MAX    = SIZE >>> 1;
    var slab   = null;
    var offset = SIZE;
    return function pool_alloc(size) {
        if (size < 1 || size > MAX)
            return alloc(size);
        if (offset + size > SIZE) {
            slab = alloc(SIZE);
            offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size);
        if (offset & 7) // align to 32 bit
            offset = (offset | 7) + 1;
        return buf;
    };
}

var longbits = LongBits;



/**
 * Constructs new long bits.
 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
 * @memberof util
 * @constructor
 * @param {number} lo Low 32 bits, unsigned
 * @param {number} hi High 32 bits, unsigned
 */
function LongBits(lo, hi) {

    // note that the casts below are theoretically unnecessary as of today, but older statically
    // generated converter code might still call the ctor with signed 32bits. kept for compat.

    /**
     * Low bits.
     * @type {number}
     */
    this.lo = lo >>> 0;

    /**
     * High bits.
     * @type {number}
     */
    this.hi = hi >>> 0;
}

/**
 * Zero bits.
 * @memberof util.LongBits
 * @type {util.LongBits}
 */
var zero = LongBits.zero = new LongBits(0, 0);

zero.toNumber = function() { return 0; };
zero.zzEncode = zero.zzDecode = function() { return this; };
zero.length = function() { return 1; };

/**
 * Zero hash.
 * @memberof util.LongBits
 * @type {string}
 */
var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

/**
 * Constructs new long bits from the specified number.
 * @param {number} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.fromNumber = function fromNumber(value) {
    if (value === 0)
        return zero;
    var sign = value < 0;
    if (sign)
        value = -value;
    var lo = value >>> 0,
        hi = (value - lo) / 4294967296 >>> 0;
    if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
            lo = 0;
            if (++hi > 4294967295)
                hi = 0;
        }
    }
    return new LongBits(lo, hi);
};

/**
 * Constructs new long bits from a number, long or string.
 * @param {Long|number|string} value Value
 * @returns {util.LongBits} Instance
 */
LongBits.from = function from(value) {
    if (typeof value === "number")
        return LongBits.fromNumber(value);
    if (minimal.isString(value)) {
        /* istanbul ignore else */
        if (minimal.Long)
            value = minimal.Long.fromString(value);
        else
            return LongBits.fromNumber(parseInt(value, 10));
    }
    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
};

/**
 * Converts this long bits to a possibly unsafe JavaScript number.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {number} Possibly unsafe number
 */
LongBits.prototype.toNumber = function toNumber(unsigned) {
    if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0,
            hi = ~this.hi     >>> 0;
        if (!lo)
            hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
    }
    return this.lo + this.hi * 4294967296;
};

/**
 * Converts this long bits to a long.
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long} Long
 */
LongBits.prototype.toLong = function toLong(unsigned) {
    return minimal.Long
        ? new minimal.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
        /* istanbul ignore next */
        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
};

var charCodeAt = String.prototype.charCodeAt;

/**
 * Constructs new long bits from the specified 8 characters long hash.
 * @param {string} hash Hash
 * @returns {util.LongBits} Bits
 */
LongBits.fromHash = function fromHash(hash) {
    if (hash === zeroHash)
        return zero;
    return new LongBits(
        ( charCodeAt.call(hash, 0)
        | charCodeAt.call(hash, 1) << 8
        | charCodeAt.call(hash, 2) << 16
        | charCodeAt.call(hash, 3) << 24) >>> 0
    ,
        ( charCodeAt.call(hash, 4)
        | charCodeAt.call(hash, 5) << 8
        | charCodeAt.call(hash, 6) << 16
        | charCodeAt.call(hash, 7) << 24) >>> 0
    );
};

/**
 * Converts this long bits to a 8 characters long hash.
 * @returns {string} Hash
 */
LongBits.prototype.toHash = function toHash() {
    return String.fromCharCode(
        this.lo        & 255,
        this.lo >>> 8  & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24      ,
        this.hi        & 255,
        this.hi >>> 8  & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
    );
};

/**
 * Zig-zag encodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzEncode = function zzEncode() {
    var mask =   this.hi >> 31;
    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
    return this;
};

/**
 * Zig-zag decodes this long bits.
 * @returns {util.LongBits} `this`
 */
LongBits.prototype.zzDecode = function zzDecode() {
    var mask = -(this.lo & 1);
    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
    return this;
};

/**
 * Calculates the length of this longbits when encoded as a varint.
 * @returns {number} Length
 */
LongBits.prototype.length = function length() {
    var part0 =  this.lo,
        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
        part2 =  this.hi >>> 24;
    return part2 === 0
         ? part1 === 0
           ? part0 < 16384
             ? part0 < 128 ? 1 : 2
             : part0 < 2097152 ? 3 : 4
           : part1 < 16384
             ? part1 < 128 ? 5 : 6
             : part1 < 2097152 ? 7 : 8
         : part2 < 128 ? 9 : 10;
};

var minimal = createCommonjsModule(function (module, exports) {
var util = exports;

// used to return a Promise where callback is omitted
util.asPromise = aspromise;

// converts to / from base64 encoded strings
util.base64 = base64_1;

// base class of rpc.Service
util.EventEmitter = eventemitter;

// float handling accross browsers
util.float = float_1;

// requires modules optionally and hides the call from bundlers
util.inquire = inquire_1;

// converts to / from utf8 encoded strings
util.utf8 = utf8_1;

// provides a node-like buffer pool in the browser
util.pool = pool_1;

// utility to work with the low and high bits of a 64 bit value
util.LongBits = longbits;

/**
 * An immuable empty array.
 * @memberof util
 * @type {Array.<*>}
 * @const
 */
util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

/**
 * An immutable empty object.
 * @type {Object}
 * @const
 */
util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

/**
 * Whether running within node or not.
 * @memberof util
 * @type {boolean}
 * @const
 */
util.isNode = Boolean(commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);

/**
 * Tests if the specified value is an integer.
 * @function
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is an integer
 */
util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

/**
 * Tests if the specified value is a string.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a string
 */
util.isString = function isString(value) {
    return typeof value === "string" || value instanceof String;
};

/**
 * Tests if the specified value is a non-null object.
 * @param {*} value Value to test
 * @returns {boolean} `true` if the value is a non-null object
 */
util.isObject = function isObject(value) {
    return value && typeof value === "object";
};

/**
 * Checks if a property on a message is considered to be present.
 * This is an alias of {@link util.isSet}.
 * @function
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isset =

/**
 * Checks if a property on a message is considered to be present.
 * @param {Object} obj Plain object or message instance
 * @param {string} prop Property name
 * @returns {boolean} `true` if considered to be present, otherwise `false`
 */
util.isSet = function isSet(obj, prop) {
    var value = obj[prop];
    if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
    return false;
};

/**
 * Any compatible Buffer instance.
 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
 * @interface Buffer
 * @extends Uint8Array
 */

/**
 * Node's Buffer class if available.
 * @type {Constructor<Buffer>}
 */
util.Buffer = (function() {
    try {
        var Buffer = util.inquire("buffer").Buffer;
        // refuse to use non-node buffers if not explicitly assigned (perf reasons):
        return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
    } catch (e) {
        /* istanbul ignore next */
        return null;
    }
})();

// Internal alias of or polyfull for Buffer.from.
util._Buffer_from = null;

// Internal alias of or polyfill for Buffer.allocUnsafe.
util._Buffer_allocUnsafe = null;

/**
 * Creates a new buffer of whatever type supported by the environment.
 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
 * @returns {Uint8Array|Buffer} Buffer
 */
util.newBuffer = function newBuffer(sizeOrArray) {
    /* istanbul ignore next */
    return typeof sizeOrArray === "number"
        ? util.Buffer
            ? util._Buffer_allocUnsafe(sizeOrArray)
            : new util.Array(sizeOrArray)
        : util.Buffer
            ? util._Buffer_from(sizeOrArray)
            : typeof Uint8Array === "undefined"
                ? sizeOrArray
                : new Uint8Array(sizeOrArray);
};

/**
 * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
 * @type {Constructor<Uint8Array>}
 */
util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

/**
 * Any compatible Long instance.
 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
 * @interface Long
 * @property {number} low Low bits
 * @property {number} high High bits
 * @property {boolean} unsigned Whether unsigned or not
 */

/**
 * Long.js's Long class if available.
 * @type {Constructor<Long>}
 */
util.Long = /* istanbul ignore next */ commonjsGlobal.dcodeIO && /* istanbul ignore next */ commonjsGlobal.dcodeIO.Long || util.inquire("long");

/**
 * Regular expression used to verify 2 bit (`bool`) map keys.
 * @type {RegExp}
 * @const
 */
util.key2Re = /^true|false|0|1$/;

/**
 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

/**
 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
 * @type {RegExp}
 * @const
 */
util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

/**
 * Converts a number or long to an 8 characters long hash string.
 * @param {Long|number} value Value to convert
 * @returns {string} Hash
 */
util.longToHash = function longToHash(value) {
    return value
        ? util.LongBits.from(value).toHash()
        : util.LongBits.zeroHash;
};

/**
 * Converts an 8 characters long hash string to a long or number.
 * @param {string} hash Hash
 * @param {boolean} [unsigned=false] Whether unsigned or not
 * @returns {Long|number} Original value
 */
util.longFromHash = function longFromHash(hash, unsigned) {
    var bits = util.LongBits.fromHash(hash);
    if (util.Long)
        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
    return bits.toNumber(Boolean(unsigned));
};

/**
 * Merges the properties of the source object into the destination object.
 * @memberof util
 * @param {Object.<string,*>} dst Destination object
 * @param {Object.<string,*>} src Source object
 * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
 * @returns {Object.<string,*>} Destination object
 */
function merge(dst, src, ifNotSet) { // used by converters
    for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
        if (dst[keys[i]] === undefined || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
    return dst;
}

util.merge = merge;

/**
 * Converts the first character of a string to lower case.
 * @param {string} str String to convert
 * @returns {string} Converted string
 */
util.lcFirst = function lcFirst(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Creates a custom error constructor.
 * @memberof util
 * @param {string} name Error name
 * @returns {Constructor<Error>} Custom error constructor
 */
function newError(name) {

    function CustomError(message, properties) {

        if (!(this instanceof CustomError))
            return new CustomError(message, properties);

        // Error.call(this, message);
        // ^ just returns a new error instance because the ctor can be called as a function

        Object.defineProperty(this, "message", { get: function() { return message; } });

        /* istanbul ignore next */
        if (Error.captureStackTrace) // node
            Error.captureStackTrace(this, CustomError);
        else
            Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

        if (properties)
            merge(this, properties);
    }

    (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

    Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

    CustomError.prototype.toString = function toString() {
        return this.name + ": " + this.message;
    };

    return CustomError;
}

util.newError = newError;

/**
 * Constructs a new protocol error.
 * @classdesc Error subclass indicating a protocol specifc error.
 * @memberof util
 * @extends Error
 * @template T extends Message<T>
 * @constructor
 * @param {string} message Error message
 * @param {Object.<string,*>} [properties] Additional properties
 * @example
 * try {
 *     MyMessage.decode(someBuffer); // throws if required fields are missing
 * } catch (e) {
 *     if (e instanceof ProtocolError && e.instance)
 *         console.log("decoded so far: " + JSON.stringify(e.instance));
 * }
 */
util.ProtocolError = newError("ProtocolError");

/**
 * So far decoded message instance.
 * @name util.ProtocolError#instance
 * @type {Message<T>}
 */

/**
 * A OneOf getter as returned by {@link util.oneOfGetter}.
 * @typedef OneOfGetter
 * @type {function}
 * @returns {string|undefined} Set field name, if any
 */

/**
 * Builds a getter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfGetter} Unbound getter
 */
util.oneOfGetter = function getOneOf(fieldNames) {
    var fieldMap = {};
    for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;

    /**
     * @returns {string|undefined} Set field name, if any
     * @this Object
     * @ignore
     */
    return function() { // eslint-disable-line consistent-return
        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                return keys[i];
    };
};

/**
 * A OneOf setter as returned by {@link util.oneOfSetter}.
 * @typedef OneOfSetter
 * @type {function}
 * @param {string|undefined} value Field name
 * @returns {undefined}
 */

/**
 * Builds a setter for a oneof's present field name.
 * @param {string[]} fieldNames Field names
 * @returns {OneOfSetter} Unbound setter
 */
util.oneOfSetter = function setOneOf(fieldNames) {

    /**
     * @param {string} name Field name
     * @returns {undefined}
     * @this Object
     * @ignore
     */
    return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
                delete this[fieldNames[i]];
    };
};

/**
 * Default conversion options used for {@link Message#toJSON} implementations.
 *
 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
 *
 * - Longs become strings
 * - Enums become string keys
 * - Bytes become base64 encoded strings
 * - (Sub-)Messages become plain objects
 * - Maps become plain objects with all string keys
 * - Repeated fields become arrays
 * - NaN and Infinity for float and double fields become strings
 *
 * @type {IConversionOptions}
 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
 */
util.toJSONOptions = {
    longs: String,
    enums: String,
    bytes: String,
    json: true
};

util._configure = function() {
    var Buffer = util.Buffer;
    /* istanbul ignore if */
    if (!Buffer) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
    }
    // because node 4.x buffers are incompatible & immutable
    // see: https://github.com/dcodeIO/protobuf.js/pull/665
    util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
        /* istanbul ignore next */
        function Buffer_from(value, encoding) {
            return new Buffer(value, encoding);
        };
    util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
        /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
            return new Buffer(size);
        };
};
});

var writer = Writer;



var BufferWriter; // cyclic

var LongBits$1  = minimal.LongBits,
    base64    = minimal.base64,
    utf8      = minimal.utf8;

/**
 * Constructs a new writer operation instance.
 * @classdesc Scheduled writer operation.
 * @constructor
 * @param {function(*, Uint8Array, number)} fn Function to call
 * @param {number} len Value byte length
 * @param {*} val Value to write
 * @ignore
 */
function Op(fn, len, val) {

    /**
     * Function to call.
     * @type {function(Uint8Array, number, *)}
     */
    this.fn = fn;

    /**
     * Value byte length.
     * @type {number}
     */
    this.len = len;

    /**
     * Next operation.
     * @type {Writer.Op|undefined}
     */
    this.next = undefined;

    /**
     * Value to write.
     * @type {*}
     */
    this.val = val; // type varies
}

/* istanbul ignore next */
function noop() {} // eslint-disable-line no-empty-function

/**
 * Constructs a new writer state instance.
 * @classdesc Copied writer state.
 * @memberof Writer
 * @constructor
 * @param {Writer} writer Writer to copy state from
 * @ignore
 */
function State(writer) {

    /**
     * Current head.
     * @type {Writer.Op}
     */
    this.head = writer.head;

    /**
     * Current tail.
     * @type {Writer.Op}
     */
    this.tail = writer.tail;

    /**
     * Current buffer length.
     * @type {number}
     */
    this.len = writer.len;

    /**
     * Next state.
     * @type {State|null}
     */
    this.next = writer.states;
}

/**
 * Constructs a new writer instance.
 * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 */
function Writer() {

    /**
     * Current length.
     * @type {number}
     */
    this.len = 0;

    /**
     * Operations head.
     * @type {Object}
     */
    this.head = new Op(noop, 0, 0);

    /**
     * Operations tail
     * @type {Object}
     */
    this.tail = this.head;

    /**
     * Linked forked states.
     * @type {Object|null}
     */
    this.states = null;

    // When a value is written, the writer calculates its byte length and puts it into a linked
    // list of operations to perform when finish() is called. This both allows us to allocate
    // buffers of the exact required size and reduces the amount of work we have to do compared
    // to first calculating over objects and then encoding over objects. In our case, the encoding
    // part is just a linked list walk calling operations with already prepared values.
}

/**
 * Creates a new writer.
 * @function
 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
 */
Writer.create = minimal.Buffer
    ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
            return new BufferWriter();
        })();
    }
    /* istanbul ignore next */
    : function create_array() {
        return new Writer();
    };

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Uint8Array} Buffer
 */
Writer.alloc = function alloc(size) {
    return new minimal.Array(size);
};

// Use Uint8Array buffer pool in the browser, just like node does with buffers
/* istanbul ignore else */
if (minimal.Array !== Array)
    Writer.alloc = minimal.pool(Writer.alloc, minimal.Array.prototype.subarray);

/**
 * Pushes a new operation to the queue.
 * @param {function(Uint8Array, number, *)} fn Function to call
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @returns {Writer} `this`
 * @private
 */
Writer.prototype._push = function push(fn, len, val) {
    this.tail = this.tail.next = new Op(fn, len, val);
    this.len += len;
    return this;
};

function writeByte(val, buf, pos) {
    buf[pos] = val & 255;
}

function writeVarint32(val, buf, pos) {
    while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
    }
    buf[pos] = val;
}

/**
 * Constructs a new varint writer operation instance.
 * @classdesc Scheduled varint writer operation.
 * @extends Op
 * @constructor
 * @param {number} len Value byte length
 * @param {number} val Value to write
 * @ignore
 */
function VarintOp(len, val) {
    this.len = len;
    this.next = undefined;
    this.val = val;
}

VarintOp.prototype = Object.create(Op.prototype);
VarintOp.prototype.fn = writeVarint32;

/**
 * Writes an unsigned 32 bit value as a varint.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.uint32 = function write_uint32(value) {
    // here, the call to this.push has been inlined and a varint specific Op subclass is used.
    // uint32 is by far the most frequently used operation and benefits significantly from this.
    this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0)
                < 128       ? 1
        : value < 16384     ? 2
        : value < 2097152   ? 3
        : value < 268435456 ? 4
        :                     5,
    value)).len;
    return this;
};

/**
 * Writes a signed 32 bit value as a varint.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.int32 = function write_int32(value) {
    return value < 0
        ? this._push(writeVarint64, 10, LongBits$1.fromNumber(value)) // 10 bytes per spec
        : this.uint32(value);
};

/**
 * Writes a 32 bit value as a varint, zig-zag encoded.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sint32 = function write_sint32(value) {
    return this.uint32((value << 1 ^ value >> 31) >>> 0);
};

function writeVarint64(val, buf, pos) {
    while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
    }
    while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
    }
    buf[pos++] = val.lo;
}

/**
 * Writes an unsigned 64 bit value as a varint.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.uint64 = function write_uint64(value) {
    var bits = LongBits$1.from(value);
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a signed 64 bit value as a varint.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.int64 = Writer.prototype.uint64;

/**
 * Writes a signed 64 bit value as a varint, zig-zag encoded.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sint64 = function write_sint64(value) {
    var bits = LongBits$1.from(value).zzEncode();
    return this._push(writeVarint64, bits.length(), bits);
};

/**
 * Writes a boolish value as a varint.
 * @param {boolean} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.bool = function write_bool(value) {
    return this._push(writeByte, 1, value ? 1 : 0);
};

function writeFixed32(val, buf, pos) {
    buf[pos    ] =  val         & 255;
    buf[pos + 1] =  val >>> 8   & 255;
    buf[pos + 2] =  val >>> 16  & 255;
    buf[pos + 3] =  val >>> 24;
}

/**
 * Writes an unsigned 32 bit value as fixed 32 bits.
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.fixed32 = function write_fixed32(value) {
    return this._push(writeFixed32, 4, value >>> 0);
};

/**
 * Writes a signed 32 bit value as fixed 32 bits.
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.sfixed32 = Writer.prototype.fixed32;

/**
 * Writes an unsigned 64 bit value as fixed 64 bits.
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.fixed64 = function write_fixed64(value) {
    var bits = LongBits$1.from(value);
    return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
};

/**
 * Writes a signed 64 bit value as fixed 64 bits.
 * @function
 * @param {Long|number|string} value Value to write
 * @returns {Writer} `this`
 * @throws {TypeError} If `value` is a string and no long library is present.
 */
Writer.prototype.sfixed64 = Writer.prototype.fixed64;

/**
 * Writes a float (32 bit).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.float = function write_float(value) {
    return this._push(minimal.float.writeFloatLE, 4, value);
};

/**
 * Writes a double (64 bit float).
 * @function
 * @param {number} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.double = function write_double(value) {
    return this._push(minimal.float.writeDoubleLE, 8, value);
};

var writeBytes = minimal.Array.prototype.set
    ? function writeBytes_set(val, buf, pos) {
        buf.set(val, pos); // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytes_for(val, buf, pos) {
        for (var i = 0; i < val.length; ++i)
            buf[pos + i] = val[i];
    };

/**
 * Writes a sequence of bytes.
 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
 * @returns {Writer} `this`
 */
Writer.prototype.bytes = function write_bytes(value) {
    var len = value.length >>> 0;
    if (!len)
        return this._push(writeByte, 1, 0);
    if (minimal.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
    }
    return this.uint32(len)._push(writeBytes, len, value);
};

/**
 * Writes a string.
 * @param {string} value Value to write
 * @returns {Writer} `this`
 */
Writer.prototype.string = function write_string(value) {
    var len = utf8.length(value);
    return len
        ? this.uint32(len)._push(utf8.write, len, value)
        : this._push(writeByte, 1, 0);
};

/**
 * Forks this writer's state by pushing it to a stack.
 * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
 * @returns {Writer} `this`
 */
Writer.prototype.fork = function fork() {
    this.states = new State(this);
    this.head = this.tail = new Op(noop, 0, 0);
    this.len = 0;
    return this;
};

/**
 * Resets this instance to the last state.
 * @returns {Writer} `this`
 */
Writer.prototype.reset = function reset() {
    if (this.states) {
        this.head   = this.states.head;
        this.tail   = this.states.tail;
        this.len    = this.states.len;
        this.states = this.states.next;
    } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len  = 0;
    }
    return this;
};

/**
 * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
 * @returns {Writer} `this`
 */
Writer.prototype.ldelim = function ldelim() {
    var head = this.head,
        tail = this.tail,
        len  = this.len;
    this.reset().uint32(len);
    if (len) {
        this.tail.next = head.next; // skip noop
        this.tail = tail;
        this.len += len;
    }
    return this;
};

/**
 * Finishes the write operation.
 * @returns {Uint8Array} Finished buffer
 */
Writer.prototype.finish = function finish() {
    var head = this.head.next, // skip noop
        buf  = this.constructor.alloc(this.len),
        pos  = 0;
    while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
    }
    // this.head = this.tail = null;
    return buf;
};

Writer._configure = function(BufferWriter_) {
    BufferWriter = BufferWriter_;
};

var writer_buffer = BufferWriter$1;

// extends Writer

(BufferWriter$1.prototype = Object.create(writer.prototype)).constructor = BufferWriter$1;



var Buffer = minimal.Buffer;

/**
 * Constructs a new buffer writer instance.
 * @classdesc Wire format writer using node buffers.
 * @extends Writer
 * @constructor
 */
function BufferWriter$1() {
    writer.call(this);
}

/**
 * Allocates a buffer of the specified size.
 * @param {number} size Buffer size
 * @returns {Buffer} Buffer
 */
BufferWriter$1.alloc = function alloc_buffer(size) {
    return (BufferWriter$1.alloc = minimal._Buffer_allocUnsafe)(size);
};

var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
    ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                           // also works for plain array values
    }
    /* istanbul ignore next */
    : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy) // Buffer values
            val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length;) // plain array values
            buf[pos++] = val[i++];
    };

/**
 * @override
 */
BufferWriter$1.prototype.bytes = function write_bytes_buffer(value) {
    if (minimal.isString(value))
        value = minimal._Buffer_from(value, "base64");
    var len = value.length >>> 0;
    this.uint32(len);
    if (len)
        this._push(writeBytesBuffer, len, value);
    return this;
};

function writeStringBuffer(val, buf, pos) {
    if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
        minimal.utf8.write(val, buf, pos);
    else
        buf.utf8Write(val, pos);
}

/**
 * @override
 */
BufferWriter$1.prototype.string = function write_string_buffer(value) {
    var len = Buffer.byteLength(value);
    this.uint32(len);
    if (len)
        this._push(writeStringBuffer, len, value);
    return this;
};

var reader = Reader;



var BufferReader; // cyclic

var LongBits$2  = minimal.LongBits,
    utf8$1      = minimal.utf8;

/* istanbul ignore next */
function indexOutOfRange(reader, writeLength) {
    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
}

/**
 * Constructs a new reader instance using the specified buffer.
 * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
 * @constructor
 * @param {Uint8Array} buffer Buffer to read from
 */
function Reader(buffer) {

    /**
     * Read buffer.
     * @type {Uint8Array}
     */
    this.buf = buffer;

    /**
     * Read buffer position.
     * @type {number}
     */
    this.pos = 0;

    /**
     * Read buffer length.
     * @type {number}
     */
    this.len = buffer.length;
}

var create_array = typeof Uint8Array !== "undefined"
    ? function create_typed_array(buffer) {
        if (buffer instanceof Uint8Array || Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    }
    /* istanbul ignore next */
    : function create_array(buffer) {
        if (Array.isArray(buffer))
            return new Reader(buffer);
        throw Error("illegal buffer");
    };

/**
 * Creates a new reader using the specified buffer.
 * @function
 * @param {Uint8Array|Buffer} buffer Buffer to read from
 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
 * @throws {Error} If `buffer` is not a valid buffer
 */
Reader.create = minimal.Buffer
    ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer) {
            return minimal.Buffer.isBuffer(buffer)
                ? new BufferReader(buffer)
                /* istanbul ignore next */
                : create_array(buffer);
        })(buffer);
    }
    /* istanbul ignore next */
    : create_array;

Reader.prototype._slice = minimal.Array.prototype.subarray || /* istanbul ignore next */ minimal.Array.prototype.slice;

/**
 * Reads a varint as an unsigned 32 bit value.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.uint32 = (function read_uint32_setup() {
    var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
    return function read_uint32() {
        value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

        /* istanbul ignore if */
        if ((this.pos += 5) > this.len) {
            this.pos = this.len;
            throw indexOutOfRange(this, 10);
        }
        return value;
    };
})();

/**
 * Reads a varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.int32 = function read_int32() {
    return this.uint32() | 0;
};

/**
 * Reads a zig-zag encoded varint as a signed 32 bit value.
 * @returns {number} Value read
 */
Reader.prototype.sint32 = function read_sint32() {
    var value = this.uint32();
    return value >>> 1 ^ -(value & 1) | 0;
};

/* eslint-disable no-invalid-this */

function readLongVarint() {
    // tends to deopt with local vars for octet etc.
    var bits = new LongBits$2(0, 0);
    var i = 0;
    if (this.len - this.pos > 4) { // fast route (lo)
        for (; i < 4; ++i) {
            // 1st..4th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 5th
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
        if (this.buf[this.pos++] < 128)
            return bits;
        i = 0;
    } else {
        for (; i < 3; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 1st..3th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
        // 4th
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
    }
    if (this.len - this.pos > 4) { // fast route (hi)
        for (; i < 5; ++i) {
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    } else {
        for (; i < 5; ++i) {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
            // 6th..10th
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
        }
    }
    /* istanbul ignore next */
    throw Error("invalid varint encoding");
}

/* eslint-enable no-invalid-this */

/**
 * Reads a varint as a signed 64 bit value.
 * @name Reader#int64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as an unsigned 64 bit value.
 * @name Reader#uint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a zig-zag encoded varint as a signed 64 bit value.
 * @name Reader#sint64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a varint as a boolean.
 * @returns {boolean} Value read
 */
Reader.prototype.bool = function read_bool() {
    return this.uint32() !== 0;
};

function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
    return (buf[end - 4]
          | buf[end - 3] << 8
          | buf[end - 2] << 16
          | buf[end - 1] << 24) >>> 0;
}

/**
 * Reads fixed 32 bits as an unsigned 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.fixed32 = function read_fixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4);
};

/**
 * Reads fixed 32 bits as a signed 32 bit integer.
 * @returns {number} Value read
 */
Reader.prototype.sfixed32 = function read_sfixed32() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    return readFixed32_end(this.buf, this.pos += 4) | 0;
};

/* eslint-disable no-invalid-this */

function readFixed64(/* this: Reader */) {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);

    return new LongBits$2(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
}

/* eslint-enable no-invalid-this */

/**
 * Reads fixed 64 bits.
 * @name Reader#fixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads zig-zag encoded fixed 64 bits.
 * @name Reader#sfixed64
 * @function
 * @returns {Long} Value read
 */

/**
 * Reads a float (32 bit) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.float = function read_float() {

    /* istanbul ignore if */
    if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);

    var value = minimal.float.readFloatLE(this.buf, this.pos);
    this.pos += 4;
    return value;
};

/**
 * Reads a double (64 bit float) as a number.
 * @function
 * @returns {number} Value read
 */
Reader.prototype.double = function read_double() {

    /* istanbul ignore if */
    if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);

    var value = minimal.float.readDoubleLE(this.buf, this.pos);
    this.pos += 8;
    return value;
};

/**
 * Reads a sequence of bytes preceeded by its length as a varint.
 * @returns {Uint8Array} Value read
 */
Reader.prototype.bytes = function read_bytes() {
    var length = this.uint32(),
        start  = this.pos,
        end    = this.pos + length;

    /* istanbul ignore if */
    if (end > this.len)
        throw indexOutOfRange(this, length);

    this.pos += length;
    if (Array.isArray(this.buf)) // plain array
        return this.buf.slice(start, end);
    return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, start, end);
};

/**
 * Reads a string preceeded by its byte length as a varint.
 * @returns {string} Value read
 */
Reader.prototype.string = function read_string() {
    var bytes = this.bytes();
    return utf8$1.read(bytes, 0, bytes.length);
};

/**
 * Skips the specified number of bytes if specified, otherwise skips a varint.
 * @param {number} [length] Length if known, otherwise a varint is assumed
 * @returns {Reader} `this`
 */
Reader.prototype.skip = function skip(length) {
    if (typeof length === "number") {
        /* istanbul ignore if */
        if (this.pos + length > this.len)
            throw indexOutOfRange(this, length);
        this.pos += length;
    } else {
        do {
            /* istanbul ignore if */
            if (this.pos >= this.len)
                throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
    }
    return this;
};

/**
 * Skips the next element of the specified wire type.
 * @param {number} wireType Wire type received
 * @returns {Reader} `this`
 */
Reader.prototype.skipType = function(wireType) {
    switch (wireType) {
        case 0:
            this.skip();
            break;
        case 1:
            this.skip(8);
            break;
        case 2:
            this.skip(this.uint32());
            break;
        case 3:
            do { // eslint-disable-line no-constant-condition
                if ((wireType = this.uint32() & 7) === 4)
                    break;
                this.skipType(wireType);
            } while (true);
            break;
        case 5:
            this.skip(4);
            break;

        /* istanbul ignore next */
        default:
            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
    }
    return this;
};

Reader._configure = function(BufferReader_) {
    BufferReader = BufferReader_;

    var fn = minimal.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
    minimal.merge(Reader.prototype, {

        int64: function read_int64() {
            return readLongVarint.call(this)[fn](false);
        },

        uint64: function read_uint64() {
            return readLongVarint.call(this)[fn](true);
        },

        sint64: function read_sint64() {
            return readLongVarint.call(this).zzDecode()[fn](false);
        },

        fixed64: function read_fixed64() {
            return readFixed64.call(this)[fn](true);
        },

        sfixed64: function read_sfixed64() {
            return readFixed64.call(this)[fn](false);
        }

    });
};

var reader_buffer = BufferReader$1;

// extends Reader

(BufferReader$1.prototype = Object.create(reader.prototype)).constructor = BufferReader$1;



/**
 * Constructs a new buffer reader instance.
 * @classdesc Wire format reader using node buffers.
 * @extends Reader
 * @constructor
 * @param {Buffer} buffer Buffer to read from
 */
function BufferReader$1(buffer) {
    reader.call(this, buffer);

    /**
     * Read buffer.
     * @name BufferReader#buf
     * @type {Buffer}
     */
}

/* istanbul ignore else */
if (minimal.Buffer)
    BufferReader$1.prototype._slice = minimal.Buffer.prototype.slice;

/**
 * @override
 */
BufferReader$1.prototype.string = function read_string_buffer() {
    var len = this.uint32(); // modifies pos
    return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
};

var service = Service;



// Extends EventEmitter
(Service.prototype = Object.create(minimal.EventEmitter.prototype)).constructor = Service;

/**
 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
 *
 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
 * @typedef rpc.ServiceMethodCallback
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {Error|null} error Error, if any
 * @param {TRes} [response] Response message
 * @returns {undefined}
 */

/**
 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
 * @typedef rpc.ServiceMethod
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 * @type {function}
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
 * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
 */

/**
 * Constructs a new RPC service instance.
 * @classdesc An RPC service as returned by {@link Service#create}.
 * @exports rpc.Service
 * @extends util.EventEmitter
 * @constructor
 * @param {RPCImpl} rpcImpl RPC implementation
 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
 */
function Service(rpcImpl, requestDelimited, responseDelimited) {

    if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");

    minimal.EventEmitter.call(this);

    /**
     * RPC implementation. Becomes `null` once the service is ended.
     * @type {RPCImpl|null}
     */
    this.rpcImpl = rpcImpl;

    /**
     * Whether requests are length-delimited.
     * @type {boolean}
     */
    this.requestDelimited = Boolean(requestDelimited);

    /**
     * Whether responses are length-delimited.
     * @type {boolean}
     */
    this.responseDelimited = Boolean(responseDelimited);
}

/**
 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
 * @param {Constructor<TReq>} requestCtor Request constructor
 * @param {Constructor<TRes>} responseCtor Response constructor
 * @param {TReq|Properties<TReq>} request Request message or plain object
 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
 * @returns {undefined}
 * @template TReq extends Message<TReq>
 * @template TRes extends Message<TRes>
 */
Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

    if (!request)
        throw TypeError("request must be specified");

    var self = this;
    if (!callback)
        return minimal.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

    if (!self.rpcImpl) {
        setTimeout(function() { callback(Error("already ended")); }, 0);
        return undefined;
    }

    try {
        return self.rpcImpl(
            method,
            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
            function rpcCallback(err, response) {

                if (err) {
                    self.emit("error", err, method);
                    return callback(err);
                }

                if (response === null) {
                    self.end(/* endedByRPC */ true);
                    return undefined;
                }

                if (!(response instanceof responseCtor)) {
                    try {
                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                    } catch (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }
                }

                self.emit("data", response, method);
                return callback(null, response);
            }
        );
    } catch (err) {
        self.emit("error", err, method);
        setTimeout(function() { callback(err); }, 0);
        return undefined;
    }
};

/**
 * Ends this service and emits the `end` event.
 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
 * @returns {rpc.Service} `this`
 */
Service.prototype.end = function end(endedByRPC) {
    if (this.rpcImpl) {
        if (!endedByRPC) // signal end to rpcImpl
            this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
    }
    return this;
};

var rpc_1 = createCommonjsModule(function (module, exports) {

/**
 * Streaming RPC helpers.
 * @namespace
 */
var rpc = exports;

/**
 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
 * @typedef RPCImpl
 * @type {function}
 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
 * @param {Uint8Array} requestData Request data
 * @param {RPCImplCallback} callback Callback function
 * @returns {undefined}
 * @example
 * function rpcImpl(method, requestData, callback) {
 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
 *         throw Error("no such method");
 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
 *         callback(err, responseData);
 *     });
 * }
 */

/**
 * Node-style callback as used by {@link RPCImpl}.
 * @typedef RPCImplCallback
 * @type {function}
 * @param {Error|null} error Error, if any, otherwise `null`
 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
 * @returns {undefined}
 */

rpc.Service = service;
});

var roots = {};

var indexMinimal = createCommonjsModule(function (module, exports) {
var protobuf = exports;

/**
 * Build type, one of `"full"`, `"light"` or `"minimal"`.
 * @name build
 * @type {string}
 * @const
 */
protobuf.build = "minimal";

// Serialization
protobuf.Writer       = writer;
protobuf.BufferWriter = writer_buffer;
protobuf.Reader       = reader;
protobuf.BufferReader = reader_buffer;

// Utility
protobuf.util         = minimal;
protobuf.rpc          = rpc_1;
protobuf.roots        = roots;
protobuf.configure    = configure;

/* istanbul ignore next */
/**
 * Reconfigures the library according to the environment.
 * @returns {undefined}
 */
function configure() {
    protobuf.Reader._configure(protobuf.BufferReader);
    protobuf.util._configure();
}

// Configure serialization
protobuf.Writer._configure(protobuf.BufferWriter);
configure();
});

var minimal$1 = indexMinimal;
var minimal_1 = minimal$1.roots;
var minimal_2 = minimal$1.Reader;
var minimal_3 = minimal$1.util;

/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/

// Common aliases
const $Reader = minimal_2, $util = minimal_3;

// Exported root namespace
const $root = minimal_1["default"] || (minimal_1["default"] = {});

const tensorflow = $root.tensorflow = (() => {

    /**
     * Namespace tensorflow.
     * @exports tensorflow
     * @namespace
     */
    const tensorflow = {};

    tensorflow.Any = (function() {

        /**
         * Properties of an Any.
         * @memberof tensorflow
         * @interface IAny
         * @property {string|null} [typeUrl] Any typeUrl
         * @property {Uint8Array|null} [value] Any value
         */

        /**
         * Constructs a new Any.
         * @memberof tensorflow
         * @classdesc Represents an Any.
         * @implements IAny
         * @constructor
         * @param {tensorflow.IAny=} [p] Properties to set
         */
        function Any(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * Any typeUrl.
         * @member {string} typeUrl
         * @memberof tensorflow.Any
         * @instance
         */
        Any.prototype.typeUrl = "";

        /**
         * Any value.
         * @member {Uint8Array} value
         * @memberof tensorflow.Any
         * @instance
         */
        Any.prototype.value = $util.newBuffer([]);

        /**
         * Decodes an Any message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.Any
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.Any} Any
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Any.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.Any();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.typeUrl = r.string();
                    break;
                case 2:
                    m.value = r.bytes();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Any;
    })();

    /**
     * DataType enum.
     * @name tensorflow.DataType
     * @enum {string}
     * @property {number} DT_INVALID=0 DT_INVALID value
     * @property {number} DT_FLOAT=1 DT_FLOAT value
     * @property {number} DT_DOUBLE=2 DT_DOUBLE value
     * @property {number} DT_INT32=3 DT_INT32 value
     * @property {number} DT_UINT8=4 DT_UINT8 value
     * @property {number} DT_INT16=5 DT_INT16 value
     * @property {number} DT_INT8=6 DT_INT8 value
     * @property {number} DT_STRING=7 DT_STRING value
     * @property {number} DT_COMPLEX64=8 DT_COMPLEX64 value
     * @property {number} DT_INT64=9 DT_INT64 value
     * @property {number} DT_BOOL=10 DT_BOOL value
     * @property {number} DT_QINT8=11 DT_QINT8 value
     * @property {number} DT_QUINT8=12 DT_QUINT8 value
     * @property {number} DT_QINT32=13 DT_QINT32 value
     * @property {number} DT_BFLOAT16=14 DT_BFLOAT16 value
     * @property {number} DT_FLOAT_REF=101 DT_FLOAT_REF value
     * @property {number} DT_DOUBLE_REF=102 DT_DOUBLE_REF value
     * @property {number} DT_INT32_REF=103 DT_INT32_REF value
     * @property {number} DT_UINT8_REF=104 DT_UINT8_REF value
     * @property {number} DT_INT16_REF=105 DT_INT16_REF value
     * @property {number} DT_INT8_REF=106 DT_INT8_REF value
     * @property {number} DT_STRING_REF=107 DT_STRING_REF value
     * @property {number} DT_COMPLEX64_REF=108 DT_COMPLEX64_REF value
     * @property {number} DT_INT64_REF=109 DT_INT64_REF value
     * @property {number} DT_BOOL_REF=110 DT_BOOL_REF value
     * @property {number} DT_QINT8_REF=111 DT_QINT8_REF value
     * @property {number} DT_QUINT8_REF=112 DT_QUINT8_REF value
     * @property {number} DT_QINT32_REF=113 DT_QINT32_REF value
     * @property {number} DT_BFLOAT16_REF=114 DT_BFLOAT16_REF value
     */
    tensorflow.DataType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DT_INVALID"] = 0;
        values[valuesById[1] = "DT_FLOAT"] = 1;
        values[valuesById[2] = "DT_DOUBLE"] = 2;
        values[valuesById[3] = "DT_INT32"] = 3;
        values[valuesById[4] = "DT_UINT8"] = 4;
        values[valuesById[5] = "DT_INT16"] = 5;
        values[valuesById[6] = "DT_INT8"] = 6;
        values[valuesById[7] = "DT_STRING"] = 7;
        values[valuesById[8] = "DT_COMPLEX64"] = 8;
        values[valuesById[9] = "DT_INT64"] = 9;
        values[valuesById[10] = "DT_BOOL"] = 10;
        values[valuesById[11] = "DT_QINT8"] = 11;
        values[valuesById[12] = "DT_QUINT8"] = 12;
        values[valuesById[13] = "DT_QINT32"] = 13;
        values[valuesById[14] = "DT_BFLOAT16"] = 14;
        values[valuesById[101] = "DT_FLOAT_REF"] = 101;
        values[valuesById[102] = "DT_DOUBLE_REF"] = 102;
        values[valuesById[103] = "DT_INT32_REF"] = 103;
        values[valuesById[104] = "DT_UINT8_REF"] = 104;
        values[valuesById[105] = "DT_INT16_REF"] = 105;
        values[valuesById[106] = "DT_INT8_REF"] = 106;
        values[valuesById[107] = "DT_STRING_REF"] = 107;
        values[valuesById[108] = "DT_COMPLEX64_REF"] = 108;
        values[valuesById[109] = "DT_INT64_REF"] = 109;
        values[valuesById[110] = "DT_BOOL_REF"] = 110;
        values[valuesById[111] = "DT_QINT8_REF"] = 111;
        values[valuesById[112] = "DT_QUINT8_REF"] = 112;
        values[valuesById[113] = "DT_QINT32_REF"] = 113;
        values[valuesById[114] = "DT_BFLOAT16_REF"] = 114;
        return values;
    })();

    tensorflow.TensorShape = (function() {

        /**
         * Properties of a TensorShape.
         * @memberof tensorflow
         * @interface ITensorShape
         * @property {Array.<tensorflow.TensorShape.IDim>|null} [dim] TensorShape dim
         * @property {boolean|null} [unknownRank] TensorShape unknownRank
         */

        /**
         * Constructs a new TensorShape.
         * @memberof tensorflow
         * @classdesc Represents a TensorShape.
         * @implements ITensorShape
         * @constructor
         * @param {tensorflow.ITensorShape=} [p] Properties to set
         */
        function TensorShape(p) {
            this.dim = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * TensorShape dim.
         * @member {Array.<tensorflow.TensorShape.IDim>} dim
         * @memberof tensorflow.TensorShape
         * @instance
         */
        TensorShape.prototype.dim = $util.emptyArray;

        /**
         * TensorShape unknownRank.
         * @member {boolean} unknownRank
         * @memberof tensorflow.TensorShape
         * @instance
         */
        TensorShape.prototype.unknownRank = false;

        /**
         * Decodes a TensorShape message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.TensorShape
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.TensorShape} TensorShape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TensorShape.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorShape();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 2:
                    if (!(m.dim && m.dim.length))
                        m.dim = [];
                    m.dim.push($root.tensorflow.TensorShape.Dim.decode(r, r.uint32()));
                    break;
                case 3:
                    m.unknownRank = r.bool();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        TensorShape.Dim = (function() {

            /**
             * Properties of a Dim.
             * @memberof tensorflow.TensorShape
             * @interface IDim
             * @property {number|Long|null} [size] Dim size
             * @property {string|null} [name] Dim name
             */

            /**
             * Constructs a new Dim.
             * @memberof tensorflow.TensorShape
             * @classdesc Represents a Dim.
             * @implements IDim
             * @constructor
             * @param {tensorflow.TensorShape.IDim=} [p] Properties to set
             */
            function Dim(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * Dim size.
             * @member {number|Long} size
             * @memberof tensorflow.TensorShape.Dim
             * @instance
             */
            Dim.prototype.size = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Dim name.
             * @member {string} name
             * @memberof tensorflow.TensorShape.Dim
             * @instance
             */
            Dim.prototype.name = "";

            /**
             * Decodes a Dim message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.TensorShape.Dim
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.TensorShape.Dim} Dim
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Dim.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorShape.Dim();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.size = r.int64();
                        break;
                    case 2:
                        m.name = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return Dim;
        })();

        return TensorShape;
    })();

    tensorflow.Tensor = (function() {

        /**
         * Properties of a Tensor.
         * @memberof tensorflow
         * @interface ITensor
         * @property {tensorflow.DataType|null} [dtype] Tensor dtype
         * @property {tensorflow.ITensorShape|null} [tensorShape] Tensor tensorShape
         * @property {number|null} [versionNumber] Tensor versionNumber
         * @property {Uint8Array|null} [tensorContent] Tensor tensorContent
         * @property {Array.<number>|null} [floatVal] Tensor floatVal
         * @property {Array.<number>|null} [doubleVal] Tensor doubleVal
         * @property {Array.<number>|null} [intVal] Tensor intVal
         * @property {Array.<Uint8Array>|null} [stringVal] Tensor stringVal
         * @property {Array.<number>|null} [scomplexVal] Tensor scomplexVal
         * @property {Array.<number|Long>|null} [int64Val] Tensor int64Val
         * @property {Array.<boolean>|null} [boolVal] Tensor boolVal
         * @property {Array.<number>|null} [uint32Val] Tensor uint32Val
         * @property {Array.<number|Long>|null} [uint64Val] Tensor uint64Val
         */

        /**
         * Constructs a new Tensor.
         * @memberof tensorflow
         * @classdesc Represents a Tensor.
         * @implements ITensor
         * @constructor
         * @param {tensorflow.ITensor=} [p] Properties to set
         */
        function Tensor(p) {
            this.floatVal = [];
            this.doubleVal = [];
            this.intVal = [];
            this.stringVal = [];
            this.scomplexVal = [];
            this.int64Val = [];
            this.boolVal = [];
            this.uint32Val = [];
            this.uint64Val = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * Tensor dtype.
         * @member {tensorflow.DataType} dtype
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.dtype = 0;

        /**
         * Tensor tensorShape.
         * @member {tensorflow.ITensorShape|null|undefined} tensorShape
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.tensorShape = null;

        /**
         * Tensor versionNumber.
         * @member {number} versionNumber
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.versionNumber = 0;

        /**
         * Tensor tensorContent.
         * @member {Uint8Array} tensorContent
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.tensorContent = $util.newBuffer([]);

        /**
         * Tensor floatVal.
         * @member {Array.<number>} floatVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.floatVal = $util.emptyArray;

        /**
         * Tensor doubleVal.
         * @member {Array.<number>} doubleVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.doubleVal = $util.emptyArray;

        /**
         * Tensor intVal.
         * @member {Array.<number>} intVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.intVal = $util.emptyArray;

        /**
         * Tensor stringVal.
         * @member {Array.<Uint8Array>} stringVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.stringVal = $util.emptyArray;

        /**
         * Tensor scomplexVal.
         * @member {Array.<number>} scomplexVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.scomplexVal = $util.emptyArray;

        /**
         * Tensor int64Val.
         * @member {Array.<number|Long>} int64Val
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.int64Val = $util.emptyArray;

        /**
         * Tensor boolVal.
         * @member {Array.<boolean>} boolVal
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.boolVal = $util.emptyArray;

        /**
         * Tensor uint32Val.
         * @member {Array.<number>} uint32Val
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.uint32Val = $util.emptyArray;

        /**
         * Tensor uint64Val.
         * @member {Array.<number|Long>} uint64Val
         * @memberof tensorflow.Tensor
         * @instance
         */
        Tensor.prototype.uint64Val = $util.emptyArray;

        /**
         * Decodes a Tensor message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.Tensor
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.Tensor} Tensor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Tensor.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.Tensor();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.dtype = r.int32();
                    break;
                case 2:
                    m.tensorShape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                    break;
                case 3:
                    m.versionNumber = r.int32();
                    break;
                case 4:
                    m.tensorContent = r.bytes();
                    break;
                case 5:
                    if (!(m.floatVal && m.floatVal.length))
                        m.floatVal = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.floatVal.push(r.float());
                    } else
                        m.floatVal.push(r.float());
                    break;
                case 6:
                    if (!(m.doubleVal && m.doubleVal.length))
                        m.doubleVal = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.doubleVal.push(r.double());
                    } else
                        m.doubleVal.push(r.double());
                    break;
                case 7:
                    if (!(m.intVal && m.intVal.length))
                        m.intVal = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.intVal.push(r.int32());
                    } else
                        m.intVal.push(r.int32());
                    break;
                case 8:
                    if (!(m.stringVal && m.stringVal.length))
                        m.stringVal = [];
                    m.stringVal.push(r.bytes());
                    break;
                case 9:
                    if (!(m.scomplexVal && m.scomplexVal.length))
                        m.scomplexVal = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.scomplexVal.push(r.float());
                    } else
                        m.scomplexVal.push(r.float());
                    break;
                case 10:
                    if (!(m.int64Val && m.int64Val.length))
                        m.int64Val = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.int64Val.push(r.int64());
                    } else
                        m.int64Val.push(r.int64());
                    break;
                case 11:
                    if (!(m.boolVal && m.boolVal.length))
                        m.boolVal = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.boolVal.push(r.bool());
                    } else
                        m.boolVal.push(r.bool());
                    break;
                case 16:
                    if (!(m.uint32Val && m.uint32Val.length))
                        m.uint32Val = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.uint32Val.push(r.uint32());
                    } else
                        m.uint32Val.push(r.uint32());
                    break;
                case 17:
                    if (!(m.uint64Val && m.uint64Val.length))
                        m.uint64Val = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.uint64Val.push(r.uint64());
                    } else
                        m.uint64Val.push(r.uint64());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Tensor;
    })();

    tensorflow.AttrValue = (function() {

        /**
         * Properties of an AttrValue.
         * @memberof tensorflow
         * @interface IAttrValue
         * @property {tensorflow.AttrValue.IListValue|null} [list] AttrValue list
         * @property {Uint8Array|null} [s] AttrValue s
         * @property {number|Long|null} [i] AttrValue i
         * @property {number|null} [f] AttrValue f
         * @property {boolean|null} [b] AttrValue b
         * @property {tensorflow.DataType|null} [type] AttrValue type
         * @property {tensorflow.ITensorShape|null} [shape] AttrValue shape
         * @property {tensorflow.ITensor|null} [tensor] AttrValue tensor
         * @property {string|null} [placeholder] AttrValue placeholder
         * @property {tensorflow.INameAttrList|null} [func] AttrValue func
         */

        /**
         * Constructs a new AttrValue.
         * @memberof tensorflow
         * @classdesc Represents an AttrValue.
         * @implements IAttrValue
         * @constructor
         * @param {tensorflow.IAttrValue=} [p] Properties to set
         */
        function AttrValue(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * AttrValue list.
         * @member {tensorflow.AttrValue.IListValue|null|undefined} list
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.list = null;

        /**
         * AttrValue s.
         * @member {Uint8Array} s
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.s = $util.newBuffer([]);

        /**
         * AttrValue i.
         * @member {number|Long} i
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.i = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AttrValue f.
         * @member {number} f
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.f = 0;

        /**
         * AttrValue b.
         * @member {boolean} b
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.b = false;

        /**
         * AttrValue type.
         * @member {tensorflow.DataType} type
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.type = 0;

        /**
         * AttrValue shape.
         * @member {tensorflow.ITensorShape|null|undefined} shape
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.shape = null;

        /**
         * AttrValue tensor.
         * @member {tensorflow.ITensor|null|undefined} tensor
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.tensor = null;

        /**
         * AttrValue placeholder.
         * @member {string} placeholder
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.placeholder = "";

        /**
         * AttrValue func.
         * @member {tensorflow.INameAttrList|null|undefined} func
         * @memberof tensorflow.AttrValue
         * @instance
         */
        AttrValue.prototype.func = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * AttrValue value.
         * @member {"list"|"s"|"i"|"f"|"b"|"type"|"shape"|"tensor"|"placeholder"|"func"|undefined} value
         * @memberof tensorflow.AttrValue
         * @instance
         */
        Object.defineProperty(AttrValue.prototype, "value", {
            get: $util.oneOfGetter($oneOfFields = ["list", "s", "i", "f", "b", "type", "shape", "tensor", "placeholder", "func"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Decodes an AttrValue message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.AttrValue
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.AttrValue} AttrValue
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AttrValue.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AttrValue();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.list = $root.tensorflow.AttrValue.ListValue.decode(r, r.uint32());
                    break;
                case 2:
                    m.s = r.bytes();
                    break;
                case 3:
                    m.i = r.int64();
                    break;
                case 4:
                    m.f = r.float();
                    break;
                case 5:
                    m.b = r.bool();
                    break;
                case 6:
                    m.type = r.int32();
                    break;
                case 7:
                    m.shape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                    break;
                case 8:
                    m.tensor = $root.tensorflow.Tensor.decode(r, r.uint32());
                    break;
                case 9:
                    m.placeholder = r.string();
                    break;
                case 10:
                    m.func = $root.tensorflow.NameAttrList.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        AttrValue.ListValue = (function() {

            /**
             * Properties of a ListValue.
             * @memberof tensorflow.AttrValue
             * @interface IListValue
             * @property {Array.<Uint8Array>|null} [s] ListValue s
             * @property {Array.<number|Long>|null} [i] ListValue i
             * @property {Array.<number>|null} [f] ListValue f
             * @property {Array.<boolean>|null} [b] ListValue b
             * @property {Array.<tensorflow.DataType>|null} [type] ListValue type
             * @property {Array.<tensorflow.ITensorShape>|null} [shape] ListValue shape
             * @property {Array.<tensorflow.ITensor>|null} [tensor] ListValue tensor
             * @property {Array.<tensorflow.INameAttrList>|null} [func] ListValue func
             */

            /**
             * Constructs a new ListValue.
             * @memberof tensorflow.AttrValue
             * @classdesc Represents a ListValue.
             * @implements IListValue
             * @constructor
             * @param {tensorflow.AttrValue.IListValue=} [p] Properties to set
             */
            function ListValue(p) {
                this.s = [];
                this.i = [];
                this.f = [];
                this.b = [];
                this.type = [];
                this.shape = [];
                this.tensor = [];
                this.func = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * ListValue s.
             * @member {Array.<Uint8Array>} s
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.s = $util.emptyArray;

            /**
             * ListValue i.
             * @member {Array.<number|Long>} i
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.i = $util.emptyArray;

            /**
             * ListValue f.
             * @member {Array.<number>} f
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.f = $util.emptyArray;

            /**
             * ListValue b.
             * @member {Array.<boolean>} b
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.b = $util.emptyArray;

            /**
             * ListValue type.
             * @member {Array.<tensorflow.DataType>} type
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.type = $util.emptyArray;

            /**
             * ListValue shape.
             * @member {Array.<tensorflow.ITensorShape>} shape
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.shape = $util.emptyArray;

            /**
             * ListValue tensor.
             * @member {Array.<tensorflow.ITensor>} tensor
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.tensor = $util.emptyArray;

            /**
             * ListValue func.
             * @member {Array.<tensorflow.INameAttrList>} func
             * @memberof tensorflow.AttrValue.ListValue
             * @instance
             */
            ListValue.prototype.func = $util.emptyArray;

            /**
             * Decodes a ListValue message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.AttrValue.ListValue
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.AttrValue.ListValue} ListValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ListValue.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AttrValue.ListValue();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 2:
                        if (!(m.s && m.s.length))
                            m.s = [];
                        m.s.push(r.bytes());
                        break;
                    case 3:
                        if (!(m.i && m.i.length))
                            m.i = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.i.push(r.int64());
                        } else
                            m.i.push(r.int64());
                        break;
                    case 4:
                        if (!(m.f && m.f.length))
                            m.f = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.f.push(r.float());
                        } else
                            m.f.push(r.float());
                        break;
                    case 5:
                        if (!(m.b && m.b.length))
                            m.b = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.b.push(r.bool());
                        } else
                            m.b.push(r.bool());
                        break;
                    case 6:
                        if (!(m.type && m.type.length))
                            m.type = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.type.push(r.int32());
                        } else
                            m.type.push(r.int32());
                        break;
                    case 7:
                        if (!(m.shape && m.shape.length))
                            m.shape = [];
                        m.shape.push($root.tensorflow.TensorShape.decode(r, r.uint32()));
                        break;
                    case 8:
                        if (!(m.tensor && m.tensor.length))
                            m.tensor = [];
                        m.tensor.push($root.tensorflow.Tensor.decode(r, r.uint32()));
                        break;
                    case 9:
                        if (!(m.func && m.func.length))
                            m.func = [];
                        m.func.push($root.tensorflow.NameAttrList.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return ListValue;
        })();

        return AttrValue;
    })();

    tensorflow.NameAttrList = (function() {

        /**
         * Properties of a NameAttrList.
         * @memberof tensorflow
         * @interface INameAttrList
         * @property {string|null} [name] NameAttrList name
         * @property {Object.<string,tensorflow.IAttrValue>|null} [attr] NameAttrList attr
         */

        /**
         * Constructs a new NameAttrList.
         * @memberof tensorflow
         * @classdesc Represents a NameAttrList.
         * @implements INameAttrList
         * @constructor
         * @param {tensorflow.INameAttrList=} [p] Properties to set
         */
        function NameAttrList(p) {
            this.attr = {};
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * NameAttrList name.
         * @member {string} name
         * @memberof tensorflow.NameAttrList
         * @instance
         */
        NameAttrList.prototype.name = "";

        /**
         * NameAttrList attr.
         * @member {Object.<string,tensorflow.IAttrValue>} attr
         * @memberof tensorflow.NameAttrList
         * @instance
         */
        NameAttrList.prototype.attr = $util.emptyObject;

        /**
         * Decodes a NameAttrList message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.NameAttrList
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.NameAttrList} NameAttrList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NameAttrList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.NameAttrList(), k;
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.name = r.string();
                    break;
                case 2:
                    r.skip().pos++;
                    if (m.attr === $util.emptyObject)
                        m.attr = {};
                    k = r.string();
                    r.pos++;
                    m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return NameAttrList;
    })();

    tensorflow.NodeDef = (function() {

        /**
         * Properties of a NodeDef.
         * @memberof tensorflow
         * @interface INodeDef
         * @property {string|null} [name] NodeDef name
         * @property {string|null} [op] NodeDef op
         * @property {Array.<string>|null} [input] NodeDef input
         * @property {string|null} [device] NodeDef device
         * @property {Object.<string,tensorflow.IAttrValue>|null} [attr] NodeDef attr
         */

        /**
         * Constructs a new NodeDef.
         * @memberof tensorflow
         * @classdesc Represents a NodeDef.
         * @implements INodeDef
         * @constructor
         * @param {tensorflow.INodeDef=} [p] Properties to set
         */
        function NodeDef(p) {
            this.input = [];
            this.attr = {};
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * NodeDef name.
         * @member {string} name
         * @memberof tensorflow.NodeDef
         * @instance
         */
        NodeDef.prototype.name = "";

        /**
         * NodeDef op.
         * @member {string} op
         * @memberof tensorflow.NodeDef
         * @instance
         */
        NodeDef.prototype.op = "";

        /**
         * NodeDef input.
         * @member {Array.<string>} input
         * @memberof tensorflow.NodeDef
         * @instance
         */
        NodeDef.prototype.input = $util.emptyArray;

        /**
         * NodeDef device.
         * @member {string} device
         * @memberof tensorflow.NodeDef
         * @instance
         */
        NodeDef.prototype.device = "";

        /**
         * NodeDef attr.
         * @member {Object.<string,tensorflow.IAttrValue>} attr
         * @memberof tensorflow.NodeDef
         * @instance
         */
        NodeDef.prototype.attr = $util.emptyObject;

        /**
         * Decodes a NodeDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.NodeDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.NodeDef} NodeDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NodeDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.NodeDef(), k;
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.name = r.string();
                    break;
                case 2:
                    m.op = r.string();
                    break;
                case 3:
                    if (!(m.input && m.input.length))
                        m.input = [];
                    m.input.push(r.string());
                    break;
                case 4:
                    m.device = r.string();
                    break;
                case 5:
                    r.skip().pos++;
                    if (m.attr === $util.emptyObject)
                        m.attr = {};
                    k = r.string();
                    r.pos++;
                    m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return NodeDef;
    })();

    tensorflow.VersionDef = (function() {

        /**
         * Properties of a VersionDef.
         * @memberof tensorflow
         * @interface IVersionDef
         * @property {number|null} [producer] VersionDef producer
         * @property {number|null} [minConsumer] VersionDef minConsumer
         * @property {Array.<number>|null} [badConsumers] VersionDef badConsumers
         */

        /**
         * Constructs a new VersionDef.
         * @memberof tensorflow
         * @classdesc Represents a VersionDef.
         * @implements IVersionDef
         * @constructor
         * @param {tensorflow.IVersionDef=} [p] Properties to set
         */
        function VersionDef(p) {
            this.badConsumers = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * VersionDef producer.
         * @member {number} producer
         * @memberof tensorflow.VersionDef
         * @instance
         */
        VersionDef.prototype.producer = 0;

        /**
         * VersionDef minConsumer.
         * @member {number} minConsumer
         * @memberof tensorflow.VersionDef
         * @instance
         */
        VersionDef.prototype.minConsumer = 0;

        /**
         * VersionDef badConsumers.
         * @member {Array.<number>} badConsumers
         * @memberof tensorflow.VersionDef
         * @instance
         */
        VersionDef.prototype.badConsumers = $util.emptyArray;

        /**
         * Decodes a VersionDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.VersionDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.VersionDef} VersionDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VersionDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.VersionDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.producer = r.int32();
                    break;
                case 2:
                    m.minConsumer = r.int32();
                    break;
                case 3:
                    if (!(m.badConsumers && m.badConsumers.length))
                        m.badConsumers = [];
                    if ((t & 7) === 2) {
                        var c2 = r.uint32() + r.pos;
                        while (r.pos < c2)
                            m.badConsumers.push(r.int32());
                    } else
                        m.badConsumers.push(r.int32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return VersionDef;
    })();

    tensorflow.GraphDef = (function() {

        /**
         * Properties of a GraphDef.
         * @memberof tensorflow
         * @interface IGraphDef
         * @property {Array.<tensorflow.INodeDef>|null} [node] GraphDef node
         * @property {tensorflow.IVersionDef|null} [versions] GraphDef versions
         * @property {tensorflow.IFunctionDefLibrary|null} [library] GraphDef library
         */

        /**
         * Constructs a new GraphDef.
         * @memberof tensorflow
         * @classdesc Represents a GraphDef.
         * @implements IGraphDef
         * @constructor
         * @param {tensorflow.IGraphDef=} [p] Properties to set
         */
        function GraphDef(p) {
            this.node = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * GraphDef node.
         * @member {Array.<tensorflow.INodeDef>} node
         * @memberof tensorflow.GraphDef
         * @instance
         */
        GraphDef.prototype.node = $util.emptyArray;

        /**
         * GraphDef versions.
         * @member {tensorflow.IVersionDef|null|undefined} versions
         * @memberof tensorflow.GraphDef
         * @instance
         */
        GraphDef.prototype.versions = null;

        /**
         * GraphDef library.
         * @member {tensorflow.IFunctionDefLibrary|null|undefined} library
         * @memberof tensorflow.GraphDef
         * @instance
         */
        GraphDef.prototype.library = null;

        /**
         * Decodes a GraphDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.GraphDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.GraphDef} GraphDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GraphDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.GraphDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    if (!(m.node && m.node.length))
                        m.node = [];
                    m.node.push($root.tensorflow.NodeDef.decode(r, r.uint32()));
                    break;
                case 4:
                    m.versions = $root.tensorflow.VersionDef.decode(r, r.uint32());
                    break;
                case 2:
                    m.library = $root.tensorflow.FunctionDefLibrary.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GraphDef;
    })();

    tensorflow.CollectionDef = (function() {

        /**
         * Properties of a CollectionDef.
         * @memberof tensorflow
         * @interface ICollectionDef
         * @property {tensorflow.CollectionDef.INodeList|null} [nodeList] CollectionDef nodeList
         * @property {tensorflow.CollectionDef.IBytesList|null} [bytesList] CollectionDef bytesList
         * @property {tensorflow.CollectionDef.IInt64List|null} [int64List] CollectionDef int64List
         * @property {tensorflow.CollectionDef.IFloatList|null} [floatList] CollectionDef floatList
         * @property {tensorflow.CollectionDef.IAnyList|null} [anyList] CollectionDef anyList
         */

        /**
         * Constructs a new CollectionDef.
         * @memberof tensorflow
         * @classdesc Represents a CollectionDef.
         * @implements ICollectionDef
         * @constructor
         * @param {tensorflow.ICollectionDef=} [p] Properties to set
         */
        function CollectionDef(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * CollectionDef nodeList.
         * @member {tensorflow.CollectionDef.INodeList|null|undefined} nodeList
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        CollectionDef.prototype.nodeList = null;

        /**
         * CollectionDef bytesList.
         * @member {tensorflow.CollectionDef.IBytesList|null|undefined} bytesList
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        CollectionDef.prototype.bytesList = null;

        /**
         * CollectionDef int64List.
         * @member {tensorflow.CollectionDef.IInt64List|null|undefined} int64List
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        CollectionDef.prototype.int64List = null;

        /**
         * CollectionDef floatList.
         * @member {tensorflow.CollectionDef.IFloatList|null|undefined} floatList
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        CollectionDef.prototype.floatList = null;

        /**
         * CollectionDef anyList.
         * @member {tensorflow.CollectionDef.IAnyList|null|undefined} anyList
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        CollectionDef.prototype.anyList = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * CollectionDef kind.
         * @member {"nodeList"|"bytesList"|"int64List"|"floatList"|"anyList"|undefined} kind
         * @memberof tensorflow.CollectionDef
         * @instance
         */
        Object.defineProperty(CollectionDef.prototype, "kind", {
            get: $util.oneOfGetter($oneOfFields = ["nodeList", "bytesList", "int64List", "floatList", "anyList"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Decodes a CollectionDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.CollectionDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.CollectionDef} CollectionDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CollectionDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.nodeList = $root.tensorflow.CollectionDef.NodeList.decode(r, r.uint32());
                    break;
                case 2:
                    m.bytesList = $root.tensorflow.CollectionDef.BytesList.decode(r, r.uint32());
                    break;
                case 3:
                    m.int64List = $root.tensorflow.CollectionDef.Int64List.decode(r, r.uint32());
                    break;
                case 4:
                    m.floatList = $root.tensorflow.CollectionDef.FloatList.decode(r, r.uint32());
                    break;
                case 5:
                    m.anyList = $root.tensorflow.CollectionDef.AnyList.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        CollectionDef.NodeList = (function() {

            /**
             * Properties of a NodeList.
             * @memberof tensorflow.CollectionDef
             * @interface INodeList
             * @property {Array.<string>|null} [value] NodeList value
             */

            /**
             * Constructs a new NodeList.
             * @memberof tensorflow.CollectionDef
             * @classdesc Represents a NodeList.
             * @implements INodeList
             * @constructor
             * @param {tensorflow.CollectionDef.INodeList=} [p] Properties to set
             */
            function NodeList(p) {
                this.value = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * NodeList value.
             * @member {Array.<string>} value
             * @memberof tensorflow.CollectionDef.NodeList
             * @instance
             */
            NodeList.prototype.value = $util.emptyArray;

            /**
             * Decodes a NodeList message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.CollectionDef.NodeList
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.CollectionDef.NodeList} NodeList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            NodeList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.NodeList();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.value && m.value.length))
                            m.value = [];
                        m.value.push(r.string());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return NodeList;
        })();

        CollectionDef.BytesList = (function() {

            /**
             * Properties of a BytesList.
             * @memberof tensorflow.CollectionDef
             * @interface IBytesList
             * @property {Array.<Uint8Array>|null} [value] BytesList value
             */

            /**
             * Constructs a new BytesList.
             * @memberof tensorflow.CollectionDef
             * @classdesc Represents a BytesList.
             * @implements IBytesList
             * @constructor
             * @param {tensorflow.CollectionDef.IBytesList=} [p] Properties to set
             */
            function BytesList(p) {
                this.value = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * BytesList value.
             * @member {Array.<Uint8Array>} value
             * @memberof tensorflow.CollectionDef.BytesList
             * @instance
             */
            BytesList.prototype.value = $util.emptyArray;

            /**
             * Decodes a BytesList message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.CollectionDef.BytesList
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.CollectionDef.BytesList} BytesList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BytesList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.BytesList();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.value && m.value.length))
                            m.value = [];
                        m.value.push(r.bytes());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return BytesList;
        })();

        CollectionDef.Int64List = (function() {

            /**
             * Properties of an Int64List.
             * @memberof tensorflow.CollectionDef
             * @interface IInt64List
             * @property {Array.<number|Long>|null} [value] Int64List value
             */

            /**
             * Constructs a new Int64List.
             * @memberof tensorflow.CollectionDef
             * @classdesc Represents an Int64List.
             * @implements IInt64List
             * @constructor
             * @param {tensorflow.CollectionDef.IInt64List=} [p] Properties to set
             */
            function Int64List(p) {
                this.value = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * Int64List value.
             * @member {Array.<number|Long>} value
             * @memberof tensorflow.CollectionDef.Int64List
             * @instance
             */
            Int64List.prototype.value = $util.emptyArray;

            /**
             * Decodes an Int64List message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.CollectionDef.Int64List
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.CollectionDef.Int64List} Int64List
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Int64List.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.Int64List();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.value && m.value.length))
                            m.value = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.value.push(r.int64());
                        } else
                            m.value.push(r.int64());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return Int64List;
        })();

        CollectionDef.FloatList = (function() {

            /**
             * Properties of a FloatList.
             * @memberof tensorflow.CollectionDef
             * @interface IFloatList
             * @property {Array.<number>|null} [value] FloatList value
             */

            /**
             * Constructs a new FloatList.
             * @memberof tensorflow.CollectionDef
             * @classdesc Represents a FloatList.
             * @implements IFloatList
             * @constructor
             * @param {tensorflow.CollectionDef.IFloatList=} [p] Properties to set
             */
            function FloatList(p) {
                this.value = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * FloatList value.
             * @member {Array.<number>} value
             * @memberof tensorflow.CollectionDef.FloatList
             * @instance
             */
            FloatList.prototype.value = $util.emptyArray;

            /**
             * Decodes a FloatList message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.CollectionDef.FloatList
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.CollectionDef.FloatList} FloatList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FloatList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.FloatList();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.value && m.value.length))
                            m.value = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.value.push(r.float());
                        } else
                            m.value.push(r.float());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return FloatList;
        })();

        CollectionDef.AnyList = (function() {

            /**
             * Properties of an AnyList.
             * @memberof tensorflow.CollectionDef
             * @interface IAnyList
             * @property {Array.<tensorflow.IAny>|null} [value] AnyList value
             */

            /**
             * Constructs a new AnyList.
             * @memberof tensorflow.CollectionDef
             * @classdesc Represents an AnyList.
             * @implements IAnyList
             * @constructor
             * @param {tensorflow.CollectionDef.IAnyList=} [p] Properties to set
             */
            function AnyList(p) {
                this.value = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * AnyList value.
             * @member {Array.<tensorflow.IAny>} value
             * @memberof tensorflow.CollectionDef.AnyList
             * @instance
             */
            AnyList.prototype.value = $util.emptyArray;

            /**
             * Decodes an AnyList message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.CollectionDef.AnyList
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.CollectionDef.AnyList} AnyList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AnyList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.AnyList();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.value && m.value.length))
                            m.value = [];
                        m.value.push($root.tensorflow.Any.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return AnyList;
        })();

        return CollectionDef;
    })();

    tensorflow.SaverDef = (function() {

        /**
         * Properties of a SaverDef.
         * @memberof tensorflow
         * @interface ISaverDef
         * @property {string|null} [filenameTensorName] SaverDef filenameTensorName
         * @property {string|null} [saveTensorName] SaverDef saveTensorName
         * @property {string|null} [restoreOpName] SaverDef restoreOpName
         * @property {number|null} [maxToKeep] SaverDef maxToKeep
         * @property {boolean|null} [sharded] SaverDef sharded
         * @property {number|null} [keepCheckpointEveryNHours] SaverDef keepCheckpointEveryNHours
         * @property {tensorflow.SaverDef.CheckpointFormatVersion|null} [version] SaverDef version
         */

        /**
         * Constructs a new SaverDef.
         * @memberof tensorflow
         * @classdesc Represents a SaverDef.
         * @implements ISaverDef
         * @constructor
         * @param {tensorflow.ISaverDef=} [p] Properties to set
         */
        function SaverDef(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * SaverDef filenameTensorName.
         * @member {string} filenameTensorName
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.filenameTensorName = "";

        /**
         * SaverDef saveTensorName.
         * @member {string} saveTensorName
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.saveTensorName = "";

        /**
         * SaverDef restoreOpName.
         * @member {string} restoreOpName
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.restoreOpName = "";

        /**
         * SaverDef maxToKeep.
         * @member {number} maxToKeep
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.maxToKeep = 0;

        /**
         * SaverDef sharded.
         * @member {boolean} sharded
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.sharded = false;

        /**
         * SaverDef keepCheckpointEveryNHours.
         * @member {number} keepCheckpointEveryNHours
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.keepCheckpointEveryNHours = 0;

        /**
         * SaverDef version.
         * @member {tensorflow.SaverDef.CheckpointFormatVersion} version
         * @memberof tensorflow.SaverDef
         * @instance
         */
        SaverDef.prototype.version = 0;

        /**
         * Decodes a SaverDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.SaverDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.SaverDef} SaverDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SaverDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SaverDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.filenameTensorName = r.string();
                    break;
                case 2:
                    m.saveTensorName = r.string();
                    break;
                case 3:
                    m.restoreOpName = r.string();
                    break;
                case 4:
                    m.maxToKeep = r.int32();
                    break;
                case 5:
                    m.sharded = r.bool();
                    break;
                case 6:
                    m.keepCheckpointEveryNHours = r.float();
                    break;
                case 7:
                    m.version = r.int32();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        /**
         * CheckpointFormatVersion enum.
         * @name tensorflow.SaverDef.CheckpointFormatVersion
         * @enum {string}
         * @property {number} LEGACY=0 LEGACY value
         * @property {number} V1=1 V1 value
         * @property {number} V2=2 V2 value
         */
        SaverDef.CheckpointFormatVersion = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "LEGACY"] = 0;
            values[valuesById[1] = "V1"] = 1;
            values[valuesById[2] = "V2"] = 2;
            return values;
        })();

        return SaverDef;
    })();

    tensorflow.TensorInfo = (function() {

        /**
         * Properties of a TensorInfo.
         * @memberof tensorflow
         * @interface ITensorInfo
         * @property {string|null} [name] TensorInfo name
         * @property {tensorflow.TensorInfo.ICooSparse|null} [cooSparse] TensorInfo cooSparse
         * @property {tensorflow.DataType|null} [dtype] TensorInfo dtype
         * @property {tensorflow.ITensorShape|null} [tensorShape] TensorInfo tensorShape
         */

        /**
         * Constructs a new TensorInfo.
         * @memberof tensorflow
         * @classdesc Represents a TensorInfo.
         * @implements ITensorInfo
         * @constructor
         * @param {tensorflow.ITensorInfo=} [p] Properties to set
         */
        function TensorInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * TensorInfo name.
         * @member {string} name
         * @memberof tensorflow.TensorInfo
         * @instance
         */
        TensorInfo.prototype.name = "";

        /**
         * TensorInfo cooSparse.
         * @member {tensorflow.TensorInfo.ICooSparse|null|undefined} cooSparse
         * @memberof tensorflow.TensorInfo
         * @instance
         */
        TensorInfo.prototype.cooSparse = null;

        /**
         * TensorInfo dtype.
         * @member {tensorflow.DataType} dtype
         * @memberof tensorflow.TensorInfo
         * @instance
         */
        TensorInfo.prototype.dtype = 0;

        /**
         * TensorInfo tensorShape.
         * @member {tensorflow.ITensorShape|null|undefined} tensorShape
         * @memberof tensorflow.TensorInfo
         * @instance
         */
        TensorInfo.prototype.tensorShape = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * TensorInfo encoding.
         * @member {"name"|"cooSparse"|undefined} encoding
         * @memberof tensorflow.TensorInfo
         * @instance
         */
        Object.defineProperty(TensorInfo.prototype, "encoding", {
            get: $util.oneOfGetter($oneOfFields = ["name", "cooSparse"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Decodes a TensorInfo message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.TensorInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.TensorInfo} TensorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TensorInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.name = r.string();
                    break;
                case 4:
                    m.cooSparse = $root.tensorflow.TensorInfo.CooSparse.decode(r, r.uint32());
                    break;
                case 2:
                    m.dtype = r.int32();
                    break;
                case 3:
                    m.tensorShape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        TensorInfo.CooSparse = (function() {

            /**
             * Properties of a CooSparse.
             * @memberof tensorflow.TensorInfo
             * @interface ICooSparse
             * @property {string|null} [valuesTensorName] CooSparse valuesTensorName
             * @property {string|null} [indicesTensorName] CooSparse indicesTensorName
             * @property {string|null} [denseShapeTensorName] CooSparse denseShapeTensorName
             */

            /**
             * Constructs a new CooSparse.
             * @memberof tensorflow.TensorInfo
             * @classdesc Represents a CooSparse.
             * @implements ICooSparse
             * @constructor
             * @param {tensorflow.TensorInfo.ICooSparse=} [p] Properties to set
             */
            function CooSparse(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * CooSparse valuesTensorName.
             * @member {string} valuesTensorName
             * @memberof tensorflow.TensorInfo.CooSparse
             * @instance
             */
            CooSparse.prototype.valuesTensorName = "";

            /**
             * CooSparse indicesTensorName.
             * @member {string} indicesTensorName
             * @memberof tensorflow.TensorInfo.CooSparse
             * @instance
             */
            CooSparse.prototype.indicesTensorName = "";

            /**
             * CooSparse denseShapeTensorName.
             * @member {string} denseShapeTensorName
             * @memberof tensorflow.TensorInfo.CooSparse
             * @instance
             */
            CooSparse.prototype.denseShapeTensorName = "";

            /**
             * Decodes a CooSparse message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.TensorInfo.CooSparse
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.TensorInfo.CooSparse} CooSparse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CooSparse.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorInfo.CooSparse();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.valuesTensorName = r.string();
                        break;
                    case 2:
                        m.indicesTensorName = r.string();
                        break;
                    case 3:
                        m.denseShapeTensorName = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return CooSparse;
        })();

        return TensorInfo;
    })();

    tensorflow.SignatureDef = (function() {

        /**
         * Properties of a SignatureDef.
         * @memberof tensorflow
         * @interface ISignatureDef
         * @property {Object.<string,tensorflow.ITensorInfo>|null} [inputs] SignatureDef inputs
         * @property {Object.<string,tensorflow.ITensorInfo>|null} [outputs] SignatureDef outputs
         * @property {string|null} [methodName] SignatureDef methodName
         */

        /**
         * Constructs a new SignatureDef.
         * @memberof tensorflow
         * @classdesc Represents a SignatureDef.
         * @implements ISignatureDef
         * @constructor
         * @param {tensorflow.ISignatureDef=} [p] Properties to set
         */
        function SignatureDef(p) {
            this.inputs = {};
            this.outputs = {};
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * SignatureDef inputs.
         * @member {Object.<string,tensorflow.ITensorInfo>} inputs
         * @memberof tensorflow.SignatureDef
         * @instance
         */
        SignatureDef.prototype.inputs = $util.emptyObject;

        /**
         * SignatureDef outputs.
         * @member {Object.<string,tensorflow.ITensorInfo>} outputs
         * @memberof tensorflow.SignatureDef
         * @instance
         */
        SignatureDef.prototype.outputs = $util.emptyObject;

        /**
         * SignatureDef methodName.
         * @member {string} methodName
         * @memberof tensorflow.SignatureDef
         * @instance
         */
        SignatureDef.prototype.methodName = "";

        /**
         * Decodes a SignatureDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.SignatureDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.SignatureDef} SignatureDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignatureDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SignatureDef(), k;
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    r.skip().pos++;
                    if (m.inputs === $util.emptyObject)
                        m.inputs = {};
                    k = r.string();
                    r.pos++;
                    m.inputs[k] = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                    break;
                case 2:
                    r.skip().pos++;
                    if (m.outputs === $util.emptyObject)
                        m.outputs = {};
                    k = r.string();
                    r.pos++;
                    m.outputs[k] = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                    break;
                case 3:
                    m.methodName = r.string();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SignatureDef;
    })();

    tensorflow.AssetFileDef = (function() {

        /**
         * Properties of an AssetFileDef.
         * @memberof tensorflow
         * @interface IAssetFileDef
         * @property {tensorflow.ITensorInfo|null} [tensorInfo] AssetFileDef tensorInfo
         * @property {string|null} [filename] AssetFileDef filename
         */

        /**
         * Constructs a new AssetFileDef.
         * @memberof tensorflow
         * @classdesc Represents an AssetFileDef.
         * @implements IAssetFileDef
         * @constructor
         * @param {tensorflow.IAssetFileDef=} [p] Properties to set
         */
        function AssetFileDef(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * AssetFileDef tensorInfo.
         * @member {tensorflow.ITensorInfo|null|undefined} tensorInfo
         * @memberof tensorflow.AssetFileDef
         * @instance
         */
        AssetFileDef.prototype.tensorInfo = null;

        /**
         * AssetFileDef filename.
         * @member {string} filename
         * @memberof tensorflow.AssetFileDef
         * @instance
         */
        AssetFileDef.prototype.filename = "";

        /**
         * Decodes an AssetFileDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.AssetFileDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.AssetFileDef} AssetFileDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AssetFileDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AssetFileDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.tensorInfo = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                    break;
                case 2:
                    m.filename = r.string();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AssetFileDef;
    })();

    tensorflow.OpDef = (function() {

        /**
         * Properties of an OpDef.
         * @memberof tensorflow
         * @interface IOpDef
         * @property {string|null} [name] OpDef name
         * @property {Array.<tensorflow.OpDef.IArgDef>|null} [inputArg] OpDef inputArg
         * @property {Array.<tensorflow.OpDef.IArgDef>|null} [outputArg] OpDef outputArg
         * @property {Array.<tensorflow.OpDef.IAttrDef>|null} [attr] OpDef attr
         * @property {tensorflow.OpDef.IOpDeprecation|null} [deprecation] OpDef deprecation
         * @property {string|null} [summary] OpDef summary
         * @property {string|null} [description] OpDef description
         * @property {boolean|null} [isCommutative] OpDef isCommutative
         * @property {boolean|null} [isAggregate] OpDef isAggregate
         * @property {boolean|null} [isStateful] OpDef isStateful
         * @property {boolean|null} [allowsUninitializedInput] OpDef allowsUninitializedInput
         */

        /**
         * Constructs a new OpDef.
         * @memberof tensorflow
         * @classdesc Represents an OpDef.
         * @implements IOpDef
         * @constructor
         * @param {tensorflow.IOpDef=} [p] Properties to set
         */
        function OpDef(p) {
            this.inputArg = [];
            this.outputArg = [];
            this.attr = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * OpDef name.
         * @member {string} name
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.name = "";

        /**
         * OpDef inputArg.
         * @member {Array.<tensorflow.OpDef.IArgDef>} inputArg
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.inputArg = $util.emptyArray;

        /**
         * OpDef outputArg.
         * @member {Array.<tensorflow.OpDef.IArgDef>} outputArg
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.outputArg = $util.emptyArray;

        /**
         * OpDef attr.
         * @member {Array.<tensorflow.OpDef.IAttrDef>} attr
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.attr = $util.emptyArray;

        /**
         * OpDef deprecation.
         * @member {tensorflow.OpDef.IOpDeprecation|null|undefined} deprecation
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.deprecation = null;

        /**
         * OpDef summary.
         * @member {string} summary
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.summary = "";

        /**
         * OpDef description.
         * @member {string} description
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.description = "";

        /**
         * OpDef isCommutative.
         * @member {boolean} isCommutative
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.isCommutative = false;

        /**
         * OpDef isAggregate.
         * @member {boolean} isAggregate
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.isAggregate = false;

        /**
         * OpDef isStateful.
         * @member {boolean} isStateful
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.isStateful = false;

        /**
         * OpDef allowsUninitializedInput.
         * @member {boolean} allowsUninitializedInput
         * @memberof tensorflow.OpDef
         * @instance
         */
        OpDef.prototype.allowsUninitializedInput = false;

        /**
         * Decodes an OpDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.OpDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.OpDef} OpDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.name = r.string();
                    break;
                case 2:
                    if (!(m.inputArg && m.inputArg.length))
                        m.inputArg = [];
                    m.inputArg.push($root.tensorflow.OpDef.ArgDef.decode(r, r.uint32()));
                    break;
                case 3:
                    if (!(m.outputArg && m.outputArg.length))
                        m.outputArg = [];
                    m.outputArg.push($root.tensorflow.OpDef.ArgDef.decode(r, r.uint32()));
                    break;
                case 4:
                    if (!(m.attr && m.attr.length))
                        m.attr = [];
                    m.attr.push($root.tensorflow.OpDef.AttrDef.decode(r, r.uint32()));
                    break;
                case 8:
                    m.deprecation = $root.tensorflow.OpDef.OpDeprecation.decode(r, r.uint32());
                    break;
                case 5:
                    m.summary = r.string();
                    break;
                case 6:
                    m.description = r.string();
                    break;
                case 18:
                    m.isCommutative = r.bool();
                    break;
                case 16:
                    m.isAggregate = r.bool();
                    break;
                case 17:
                    m.isStateful = r.bool();
                    break;
                case 19:
                    m.allowsUninitializedInput = r.bool();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        OpDef.ArgDef = (function() {

            /**
             * Properties of an ArgDef.
             * @memberof tensorflow.OpDef
             * @interface IArgDef
             * @property {string|null} [name] ArgDef name
             * @property {string|null} [description] ArgDef description
             * @property {tensorflow.DataType|null} [type] ArgDef type
             * @property {string|null} [typeAttr] ArgDef typeAttr
             * @property {string|null} [numberAttr] ArgDef numberAttr
             * @property {string|null} [typeListAttr] ArgDef typeListAttr
             * @property {boolean|null} [isRef] ArgDef isRef
             */

            /**
             * Constructs a new ArgDef.
             * @memberof tensorflow.OpDef
             * @classdesc Represents an ArgDef.
             * @implements IArgDef
             * @constructor
             * @param {tensorflow.OpDef.IArgDef=} [p] Properties to set
             */
            function ArgDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * ArgDef name.
             * @member {string} name
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.name = "";

            /**
             * ArgDef description.
             * @member {string} description
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.description = "";

            /**
             * ArgDef type.
             * @member {tensorflow.DataType} type
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.type = 0;

            /**
             * ArgDef typeAttr.
             * @member {string} typeAttr
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.typeAttr = "";

            /**
             * ArgDef numberAttr.
             * @member {string} numberAttr
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.numberAttr = "";

            /**
             * ArgDef typeListAttr.
             * @member {string} typeListAttr
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.typeListAttr = "";

            /**
             * ArgDef isRef.
             * @member {boolean} isRef
             * @memberof tensorflow.OpDef.ArgDef
             * @instance
             */
            ArgDef.prototype.isRef = false;

            /**
             * Decodes an ArgDef message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.OpDef.ArgDef
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.OpDef.ArgDef} ArgDef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ArgDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.ArgDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 2:
                        m.description = r.string();
                        break;
                    case 3:
                        m.type = r.int32();
                        break;
                    case 4:
                        m.typeAttr = r.string();
                        break;
                    case 5:
                        m.numberAttr = r.string();
                        break;
                    case 6:
                        m.typeListAttr = r.string();
                        break;
                    case 16:
                        m.isRef = r.bool();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return ArgDef;
        })();

        OpDef.AttrDef = (function() {

            /**
             * Properties of an AttrDef.
             * @memberof tensorflow.OpDef
             * @interface IAttrDef
             * @property {string|null} [name] AttrDef name
             * @property {string|null} [type] AttrDef type
             * @property {tensorflow.IAttrValue|null} [defaultValue] AttrDef defaultValue
             * @property {string|null} [description] AttrDef description
             * @property {boolean|null} [hasMinimum] AttrDef hasMinimum
             * @property {number|Long|null} [minimum] AttrDef minimum
             * @property {tensorflow.IAttrValue|null} [allowedValues] AttrDef allowedValues
             */

            /**
             * Constructs a new AttrDef.
             * @memberof tensorflow.OpDef
             * @classdesc Represents an AttrDef.
             * @implements IAttrDef
             * @constructor
             * @param {tensorflow.OpDef.IAttrDef=} [p] Properties to set
             */
            function AttrDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * AttrDef name.
             * @member {string} name
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.name = "";

            /**
             * AttrDef type.
             * @member {string} type
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.type = "";

            /**
             * AttrDef defaultValue.
             * @member {tensorflow.IAttrValue|null|undefined} defaultValue
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.defaultValue = null;

            /**
             * AttrDef description.
             * @member {string} description
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.description = "";

            /**
             * AttrDef hasMinimum.
             * @member {boolean} hasMinimum
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.hasMinimum = false;

            /**
             * AttrDef minimum.
             * @member {number|Long} minimum
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.minimum = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * AttrDef allowedValues.
             * @member {tensorflow.IAttrValue|null|undefined} allowedValues
             * @memberof tensorflow.OpDef.AttrDef
             * @instance
             */
            AttrDef.prototype.allowedValues = null;

            /**
             * Decodes an AttrDef message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.OpDef.AttrDef
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.OpDef.AttrDef} AttrDef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttrDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.AttrDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 2:
                        m.type = r.string();
                        break;
                    case 3:
                        m.defaultValue = $root.tensorflow.AttrValue.decode(r, r.uint32());
                        break;
                    case 4:
                        m.description = r.string();
                        break;
                    case 5:
                        m.hasMinimum = r.bool();
                        break;
                    case 6:
                        m.minimum = r.int64();
                        break;
                    case 7:
                        m.allowedValues = $root.tensorflow.AttrValue.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return AttrDef;
        })();

        OpDef.OpDeprecation = (function() {

            /**
             * Properties of an OpDeprecation.
             * @memberof tensorflow.OpDef
             * @interface IOpDeprecation
             * @property {number|null} [version] OpDeprecation version
             * @property {string|null} [explanation] OpDeprecation explanation
             */

            /**
             * Constructs a new OpDeprecation.
             * @memberof tensorflow.OpDef
             * @classdesc Represents an OpDeprecation.
             * @implements IOpDeprecation
             * @constructor
             * @param {tensorflow.OpDef.IOpDeprecation=} [p] Properties to set
             */
            function OpDeprecation(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * OpDeprecation version.
             * @member {number} version
             * @memberof tensorflow.OpDef.OpDeprecation
             * @instance
             */
            OpDeprecation.prototype.version = 0;

            /**
             * OpDeprecation explanation.
             * @member {string} explanation
             * @memberof tensorflow.OpDef.OpDeprecation
             * @instance
             */
            OpDeprecation.prototype.explanation = "";

            /**
             * Decodes an OpDeprecation message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.OpDef.OpDeprecation
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.OpDef.OpDeprecation} OpDeprecation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            OpDeprecation.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.OpDeprecation();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.version = r.int32();
                        break;
                    case 2:
                        m.explanation = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return OpDeprecation;
        })();

        return OpDef;
    })();

    tensorflow.OpList = (function() {

        /**
         * Properties of an OpList.
         * @memberof tensorflow
         * @interface IOpList
         * @property {Array.<tensorflow.IOpDef>|null} [op] OpList op
         */

        /**
         * Constructs a new OpList.
         * @memberof tensorflow
         * @classdesc Represents an OpList.
         * @implements IOpList
         * @constructor
         * @param {tensorflow.IOpList=} [p] Properties to set
         */
        function OpList(p) {
            this.op = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * OpList op.
         * @member {Array.<tensorflow.IOpDef>} op
         * @memberof tensorflow.OpList
         * @instance
         */
        OpList.prototype.op = $util.emptyArray;

        /**
         * Decodes an OpList message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.OpList
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.OpList} OpList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    if (!(m.op && m.op.length))
                        m.op = [];
                    m.op.push($root.tensorflow.OpDef.decode(r, r.uint32()));
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return OpList;
    })();

    tensorflow.MetaGraphDef = (function() {

        /**
         * Properties of a MetaGraphDef.
         * @memberof tensorflow
         * @interface IMetaGraphDef
         * @property {tensorflow.MetaGraphDef.IMetaInfoDef|null} [metaInfoDef] MetaGraphDef metaInfoDef
         * @property {tensorflow.IGraphDef|null} [graphDef] MetaGraphDef graphDef
         * @property {tensorflow.ISaverDef|null} [saverDef] MetaGraphDef saverDef
         * @property {Object.<string,tensorflow.ICollectionDef>|null} [collectionDef] MetaGraphDef collectionDef
         * @property {Object.<string,tensorflow.ISignatureDef>|null} [signatureDef] MetaGraphDef signatureDef
         * @property {Array.<tensorflow.IAssetFileDef>|null} [assetFileDef] MetaGraphDef assetFileDef
         */

        /**
         * Constructs a new MetaGraphDef.
         * @memberof tensorflow
         * @classdesc Represents a MetaGraphDef.
         * @implements IMetaGraphDef
         * @constructor
         * @param {tensorflow.IMetaGraphDef=} [p] Properties to set
         */
        function MetaGraphDef(p) {
            this.collectionDef = {};
            this.signatureDef = {};
            this.assetFileDef = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * MetaGraphDef metaInfoDef.
         * @member {tensorflow.MetaGraphDef.IMetaInfoDef|null|undefined} metaInfoDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.metaInfoDef = null;

        /**
         * MetaGraphDef graphDef.
         * @member {tensorflow.IGraphDef|null|undefined} graphDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.graphDef = null;

        /**
         * MetaGraphDef saverDef.
         * @member {tensorflow.ISaverDef|null|undefined} saverDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.saverDef = null;

        /**
         * MetaGraphDef collectionDef.
         * @member {Object.<string,tensorflow.ICollectionDef>} collectionDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.collectionDef = $util.emptyObject;

        /**
         * MetaGraphDef signatureDef.
         * @member {Object.<string,tensorflow.ISignatureDef>} signatureDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.signatureDef = $util.emptyObject;

        /**
         * MetaGraphDef assetFileDef.
         * @member {Array.<tensorflow.IAssetFileDef>} assetFileDef
         * @memberof tensorflow.MetaGraphDef
         * @instance
         */
        MetaGraphDef.prototype.assetFileDef = $util.emptyArray;

        /**
         * Decodes a MetaGraphDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.MetaGraphDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.MetaGraphDef} MetaGraphDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MetaGraphDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.MetaGraphDef(), k;
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.metaInfoDef = $root.tensorflow.MetaGraphDef.MetaInfoDef.decode(r, r.uint32());
                    break;
                case 2:
                    m.graphDef = $root.tensorflow.GraphDef.decode(r, r.uint32());
                    break;
                case 3:
                    m.saverDef = $root.tensorflow.SaverDef.decode(r, r.uint32());
                    break;
                case 4:
                    r.skip().pos++;
                    if (m.collectionDef === $util.emptyObject)
                        m.collectionDef = {};
                    k = r.string();
                    r.pos++;
                    m.collectionDef[k] = $root.tensorflow.CollectionDef.decode(r, r.uint32());
                    break;
                case 5:
                    r.skip().pos++;
                    if (m.signatureDef === $util.emptyObject)
                        m.signatureDef = {};
                    k = r.string();
                    r.pos++;
                    m.signatureDef[k] = $root.tensorflow.SignatureDef.decode(r, r.uint32());
                    break;
                case 6:
                    if (!(m.assetFileDef && m.assetFileDef.length))
                        m.assetFileDef = [];
                    m.assetFileDef.push($root.tensorflow.AssetFileDef.decode(r, r.uint32()));
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        MetaGraphDef.MetaInfoDef = (function() {

            /**
             * Properties of a MetaInfoDef.
             * @memberof tensorflow.MetaGraphDef
             * @interface IMetaInfoDef
             * @property {string|null} [metaGraphVersion] MetaInfoDef metaGraphVersion
             * @property {tensorflow.IOpList|null} [strippedOpList] MetaInfoDef strippedOpList
             * @property {tensorflow.IAny|null} [anyInfo] MetaInfoDef anyInfo
             * @property {Array.<string>|null} [tags] MetaInfoDef tags
             * @property {string|null} [tensorflowVersion] MetaInfoDef tensorflowVersion
             * @property {string|null} [tensorflowGitVersion] MetaInfoDef tensorflowGitVersion
             */

            /**
             * Constructs a new MetaInfoDef.
             * @memberof tensorflow.MetaGraphDef
             * @classdesc Represents a MetaInfoDef.
             * @implements IMetaInfoDef
             * @constructor
             * @param {tensorflow.MetaGraphDef.IMetaInfoDef=} [p] Properties to set
             */
            function MetaInfoDef(p) {
                this.tags = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            /**
             * MetaInfoDef metaGraphVersion.
             * @member {string} metaGraphVersion
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.metaGraphVersion = "";

            /**
             * MetaInfoDef strippedOpList.
             * @member {tensorflow.IOpList|null|undefined} strippedOpList
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.strippedOpList = null;

            /**
             * MetaInfoDef anyInfo.
             * @member {tensorflow.IAny|null|undefined} anyInfo
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.anyInfo = null;

            /**
             * MetaInfoDef tags.
             * @member {Array.<string>} tags
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.tags = $util.emptyArray;

            /**
             * MetaInfoDef tensorflowVersion.
             * @member {string} tensorflowVersion
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.tensorflowVersion = "";

            /**
             * MetaInfoDef tensorflowGitVersion.
             * @member {string} tensorflowGitVersion
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @instance
             */
            MetaInfoDef.prototype.tensorflowGitVersion = "";

            /**
             * Decodes a MetaInfoDef message from the specified reader or buffer.
             * @function decode
             * @memberof tensorflow.MetaGraphDef.MetaInfoDef
             * @static
             * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
             * @param {number} [l] Message length if known beforehand
             * @returns {tensorflow.MetaGraphDef.MetaInfoDef} MetaInfoDef
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MetaInfoDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.MetaGraphDef.MetaInfoDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.metaGraphVersion = r.string();
                        break;
                    case 2:
                        m.strippedOpList = $root.tensorflow.OpList.decode(r, r.uint32());
                        break;
                    case 3:
                        m.anyInfo = $root.tensorflow.Any.decode(r, r.uint32());
                        break;
                    case 4:
                        if (!(m.tags && m.tags.length))
                            m.tags = [];
                        m.tags.push(r.string());
                        break;
                    case 5:
                        m.tensorflowVersion = r.string();
                        break;
                    case 6:
                        m.tensorflowGitVersion = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return MetaInfoDef;
        })();

        return MetaGraphDef;
    })();

    tensorflow.SavedModel = (function() {

        /**
         * Properties of a SavedModel.
         * @memberof tensorflow
         * @interface ISavedModel
         * @property {number|Long|null} [savedModelSchemaVersion] SavedModel savedModelSchemaVersion
         * @property {Array.<tensorflow.IMetaGraphDef>|null} [metaGraphs] SavedModel metaGraphs
         */

        /**
         * Constructs a new SavedModel.
         * @memberof tensorflow
         * @classdesc Represents a SavedModel.
         * @implements ISavedModel
         * @constructor
         * @param {tensorflow.ISavedModel=} [p] Properties to set
         */
        function SavedModel(p) {
            this.metaGraphs = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * SavedModel savedModelSchemaVersion.
         * @member {number|Long} savedModelSchemaVersion
         * @memberof tensorflow.SavedModel
         * @instance
         */
        SavedModel.prototype.savedModelSchemaVersion = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * SavedModel metaGraphs.
         * @member {Array.<tensorflow.IMetaGraphDef>} metaGraphs
         * @memberof tensorflow.SavedModel
         * @instance
         */
        SavedModel.prototype.metaGraphs = $util.emptyArray;

        /**
         * Decodes a SavedModel message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.SavedModel
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.SavedModel} SavedModel
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SavedModel.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SavedModel();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.savedModelSchemaVersion = r.int64();
                    break;
                case 2:
                    if (!(m.metaGraphs && m.metaGraphs.length))
                        m.metaGraphs = [];
                    m.metaGraphs.push($root.tensorflow.MetaGraphDef.decode(r, r.uint32()));
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SavedModel;
    })();

    tensorflow.FunctionDefLibrary = (function() {

        /**
         * Properties of a FunctionDefLibrary.
         * @memberof tensorflow
         * @interface IFunctionDefLibrary
         * @property {Array.<tensorflow.IFunctionDef>|null} ["function"] FunctionDefLibrary function
         * @property {Array.<tensorflow.IGradientDef>|null} [gradient] FunctionDefLibrary gradient
         */

        /**
         * Constructs a new FunctionDefLibrary.
         * @memberof tensorflow
         * @classdesc Represents a FunctionDefLibrary.
         * @implements IFunctionDefLibrary
         * @constructor
         * @param {tensorflow.IFunctionDefLibrary=} [p] Properties to set
         */
        function FunctionDefLibrary(p) {
            this["function"] = [];
            this.gradient = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * FunctionDefLibrary function.
         * @member {Array.<tensorflow.IFunctionDef>} function
         * @memberof tensorflow.FunctionDefLibrary
         * @instance
         */
        FunctionDefLibrary.prototype["function"] = $util.emptyArray;

        /**
         * FunctionDefLibrary gradient.
         * @member {Array.<tensorflow.IGradientDef>} gradient
         * @memberof tensorflow.FunctionDefLibrary
         * @instance
         */
        FunctionDefLibrary.prototype.gradient = $util.emptyArray;

        /**
         * Decodes a FunctionDefLibrary message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.FunctionDefLibrary
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.FunctionDefLibrary} FunctionDefLibrary
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FunctionDefLibrary.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.FunctionDefLibrary();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    if (!(m["function"] && m["function"].length))
                        m["function"] = [];
                    m["function"].push($root.tensorflow.FunctionDef.decode(r, r.uint32()));
                    break;
                case 2:
                    if (!(m.gradient && m.gradient.length))
                        m.gradient = [];
                    m.gradient.push($root.tensorflow.GradientDef.decode(r, r.uint32()));
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FunctionDefLibrary;
    })();

    tensorflow.FunctionDef = (function() {

        /**
         * Properties of a FunctionDef.
         * @memberof tensorflow
         * @interface IFunctionDef
         * @property {tensorflow.IOpDef|null} [signature] FunctionDef signature
         * @property {Object.<string,tensorflow.IAttrValue>|null} [attr] FunctionDef attr
         * @property {Array.<tensorflow.INodeDef>|null} [nodeDef] FunctionDef nodeDef
         * @property {Object.<string,string>|null} [ret] FunctionDef ret
         */

        /**
         * Constructs a new FunctionDef.
         * @memberof tensorflow
         * @classdesc Represents a FunctionDef.
         * @implements IFunctionDef
         * @constructor
         * @param {tensorflow.IFunctionDef=} [p] Properties to set
         */
        function FunctionDef(p) {
            this.attr = {};
            this.nodeDef = [];
            this.ret = {};
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * FunctionDef signature.
         * @member {tensorflow.IOpDef|null|undefined} signature
         * @memberof tensorflow.FunctionDef
         * @instance
         */
        FunctionDef.prototype.signature = null;

        /**
         * FunctionDef attr.
         * @member {Object.<string,tensorflow.IAttrValue>} attr
         * @memberof tensorflow.FunctionDef
         * @instance
         */
        FunctionDef.prototype.attr = $util.emptyObject;

        /**
         * FunctionDef nodeDef.
         * @member {Array.<tensorflow.INodeDef>} nodeDef
         * @memberof tensorflow.FunctionDef
         * @instance
         */
        FunctionDef.prototype.nodeDef = $util.emptyArray;

        /**
         * FunctionDef ret.
         * @member {Object.<string,string>} ret
         * @memberof tensorflow.FunctionDef
         * @instance
         */
        FunctionDef.prototype.ret = $util.emptyObject;

        /**
         * Decodes a FunctionDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.FunctionDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.FunctionDef} FunctionDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FunctionDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.FunctionDef(), k;
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.signature = $root.tensorflow.OpDef.decode(r, r.uint32());
                    break;
                case 5:
                    r.skip().pos++;
                    if (m.attr === $util.emptyObject)
                        m.attr = {};
                    k = r.string();
                    r.pos++;
                    m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                    break;
                case 3:
                    if (!(m.nodeDef && m.nodeDef.length))
                        m.nodeDef = [];
                    m.nodeDef.push($root.tensorflow.NodeDef.decode(r, r.uint32()));
                    break;
                case 4:
                    r.skip().pos++;
                    if (m.ret === $util.emptyObject)
                        m.ret = {};
                    k = r.string();
                    r.pos++;
                    m.ret[k] = r.string();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FunctionDef;
    })();

    tensorflow.GradientDef = (function() {

        /**
         * Properties of a GradientDef.
         * @memberof tensorflow
         * @interface IGradientDef
         * @property {string|null} [functionName] GradientDef functionName
         * @property {string|null} [gradientFunc] GradientDef gradientFunc
         */

        /**
         * Constructs a new GradientDef.
         * @memberof tensorflow
         * @classdesc Represents a GradientDef.
         * @implements IGradientDef
         * @constructor
         * @param {tensorflow.IGradientDef=} [p] Properties to set
         */
        function GradientDef(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        /**
         * GradientDef functionName.
         * @member {string} functionName
         * @memberof tensorflow.GradientDef
         * @instance
         */
        GradientDef.prototype.functionName = "";

        /**
         * GradientDef gradientFunc.
         * @member {string} gradientFunc
         * @memberof tensorflow.GradientDef
         * @instance
         */
        GradientDef.prototype.gradientFunc = "";

        /**
         * Decodes a GradientDef message from the specified reader or buffer.
         * @function decode
         * @memberof tensorflow.GradientDef
         * @static
         * @param {$protobuf.Reader|Uint8Array} r Reader or buffer to decode from
         * @param {number} [l] Message length if known beforehand
         * @returns {tensorflow.GradientDef} GradientDef
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GradientDef.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.GradientDef();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.functionName = r.string();
                    break;
                case 2:
                    m.gradientFunc = r.string();
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GradientDef;
    })();

    return tensorflow;
})();

export default $root;
export { tensorflow };
