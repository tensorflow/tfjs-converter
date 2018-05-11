# Supported Tensorflow Ops

## Operations - Arithmetic

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Add|add|
|BiasAdd|add|
|Sub|sub|
|RealDiv|div|
|Div|div|
|Mul|mul|
|Maximum|maximum|
|Minimum|minimum|
|Pow|pow|
|SquaredDifference|squaredDifference|
|Mod|mod|


## Operations - Basic math

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Abs|abs|
|Acos|acos|
|Asin|asin|
|atan|atan|
|Ceil|ceil|
|ClipByValue|clipByValue|
|Cos|cos|
|Cosh|cosh|
|Elu|elu|
|Exp|exp|
|Floor|floor|
|Log|log|
|Neg|neg|
|Relu|relu|
|Relu6|clipByValue|
|Selu|selu|
|Sigmoid|sigmoid|
|Sin|sin|
|Sinh|sinh|
|Sqrt|sqrt|
|Rsqrt|rsqrt|
|Square|square|
|Tan|tan|
|Tanh|tanh|
|Sign|sign|
|Round|round|
|Expm1|expm1|
|Log1p|log1p|
|Reciprocal|reciprocal|
|Reciprocal|reciprocal|
|Softplus|softplus|
|Asinh|asinh|
|Acosh|acosh|
|Atanh|atanh|
|Erf|erf|
|Not mapped|leakyRelu|
|Not mapped|prelu|
|Not mapped|logSigmoid|
|Not mapped|step|


## Operations - Control Flow

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|LoopCond|loopCond|
|Switch|switch|
|Merge|merge|
|Enter|enter|
|Exit|exit|
|NextIteration|nextIteration|


## Operations - Convolution

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|AvgPool|avgPool|
|MaxPool|maxPool|
|Conv1D|conv1d|
|Conv2D|conv2d|
|Conv2DBackpropInput|conv2dTranspose|
|DepthwiseConv2d|depthwiseConv2d|
|DepthwiseConv2dNative|depthwiseConv2d|
|Not mapped|separableConv2d|


## Tensors - Creation

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Fill|fill|
|LinSpace|linspace|
|OneHot|oneHot|
|Ones|ones|
|OnesLike|onesLike|
|RandomUniform|randomUniform|
|Range|range|
|truncatedNormal|truncatedNormal|
|Zeros|zeros|
|ZerosLike|zerosLike|
|Not mapped|tensor|
|Not mapped|scalar|
|Not mapped|tensor1d|
|Not mapped|tensor2d|
|Not mapped|tensor3d|
|Not mapped|tensor4d|
|Not mapped|clone|
|Not mapped|randomNormal|
|Not mapped|fromPixels|
|Not mapped|buffer|
|Not mapped|print|
|Not mapped|variable|


## Tensorflow - Graph

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|PlaceholderWithDefault|placeholder|
|Placeholder|placeholder|
|Const|const|
|Identity|identity|
|Snapshot|snapshot|
|Shape|shape|
|Print|print|
|NoOp|noop|
|StopGradient|stopGradient|


## Operations - Logical

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Equal|equal|
|NotEqual|notEqual|
|Greater|greater|
|GreaterEqual|greaterEqual|
|Less|less|
|LessEqual|lessEqual|
|LogicalAnd|logicalAnd|
|LogicalNot|logicalNot|
|LogicalOr|logicalOr|
|Select|where|
|Not mapped|logicalXor|


## Operations - Matrices

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|MatMul|matMul|
|Transpose|transpose|
|Not mapped|outerProduct|
|Not mapped|norm|


## Operations - Normalization

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|FusedBatchNorm|batchNormalization|
|FusedBatchNormV2|batchNormalization|
|LRN|localResponseNormalization|
|Softmax|softmax|
|Not mapped|moments|


## Operations - Images

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|ResizeBilinear|resizeBilinear|
|Not mapped|resizeNearestNeighbor|


## Operations - Reduction

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Max|max|
|Mean|mean|
|Min|min|
|Sum|sum|
|ArgMax|argMax|
|ArgMin|argMin|
|Not mapped|logSumExp|


## Tensors - Slicing and Joining

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|ConcatV2|concat|
|Concat|concat|
|GatherV2|gather|
|Gather|gather|
|Reverse|reverse|
|ReverseV2|reverse|
|Slice|slice|
|Pack|stack|
|Tile|tile|
|Split|split|


## Tensors - Transformations

|Tensorflow Op Name|Tensorflow.js Op Name|
|---|---|
|Cast|cast|
|ExpandDims|expandDims|
|Pad|pad|
|PadV2|pad|
|Reshape|reshape|
|Squeeze|squeeze|


