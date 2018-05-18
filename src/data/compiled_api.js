/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const tensorflow = $root.tensorflow = (() => {

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

export { $root as default };
