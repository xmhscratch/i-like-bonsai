Manipulating hierarchical BST tree

## Installation

```sh
npm install i-like-bonsai
```

## Usage

Instantiate
----------
```javascript
import bonsai from 'i-like-bonsai'
const tree = await bonsai(rootNodeId)
// or
bonsai(rootNodeId).then((tree) => { /**/ })
```

Generate node ID
----------
```javascript
const nodeId = bonsai.getNewID()
```

Node object structural
----------
```javascript
{
  id varchar(24) NOT NULL,
  root varchar(24) NOT NULL,
  parent varchar(24),
  left int(11) NOT NULL,
  right int(11) NOT NULL,
  level int(11) NOT NULL
}
```

API References
==============

- [API References](#api-references)
  - [create](#create)
  - [import](#import)
  - [moveTo](#moveto)
  - [delete](#delete)
  - [getNode](#getnode)
  - [getRootNode](#getrootnode)
  - [getPrevNode](#getprevnode)
  - [getNodeByParentIndex](#getnodebyparentindex)
  - [getPaths](#getpaths)
  - [getLevel](#getlevel)
  - [getDepth](#getdepth)
  - [getIndexNumber](#getindexnumber)
  - [getChildren](#getchildren)
  - [getDescendants](#getdescendants)
  - [countChilds](#countchilds)
  - [toAdjacencyList](#toadjacencylist)
  - [toLinearList](#tolinearlist)
  - [TODO](#todo)
  - [Contributing](#contributing)
  - [License](#license)

create
----------
```javascript
const { nodeId } = tree.create(parentId)
```
Create new children node of `parentId`
[Back to TOC](#api-references)

import
----------
```javascript
tree.import(nodeCollection)
```
Import plain array of node object into the tree.
[Back to TOC](#api-references)

moveTo
----------
```javascript
tree.moveTo(nodeId, parentId, adjacentId)
```
Moving the `nodeId` and all of its descendant to be children of `parentId`. Siblings position (ntn + 1) to the `adjacentId`
[Back to TOC](#api-references)

delete
----------
```javascript
const errMsg = tree.delete(nodeId)
```
Delete the node itself and all of its descendant.
[Back to TOC](#api-references)

getNode
----------
```javascript
const node = tree.getNode(nodeId)
```
Get node with provided `nodeId`
[Back to TOC](#api-references)

getRootNode
----------
```javascript
const node = tree.getRootNode()
```
Get node without a parent.
[Back to TOC](#api-references)

getPrevNode
----------
```javascript
const node = tree.getPrevNode(nodeId)
```
Get siblings node on (nth - 1) position.
[Back to TOC](#api-references)

getNodeByParentIndex
----------
```javascript
const { nodeId } = tree.getNodeByParentIndex(parentId, parentIndex)
```
Get node on nth position `parentIndex` by the `parentId` node.
[Back to TOC](#api-references)

getPaths
----------
```javascript
const nodeCollection = tree.getPaths(nodeId)
```
Returns trailing list of ancestor node belongs to `nodeId`
[Back to TOC](#api-references)

getLevel
----------
```javascript
const level = tree.getLevel(nodeId)
```
Count number of ancestor node above `nodeId`
[Back to TOC](#api-references)

getDepth
----------
```javascript
const depth = tree.getDepth(nodeId)
```
Count number of descendant node below `nodeId`
[Back to TOC](#api-references)

getIndexNumber
----------
```javascript
const nodeIndex = tree.getIndexOf(nodeId)
```
Get nth position of the `nodeId` against the whole tree. Returns -1 on none exists.
[Back to TOC](#api-references)

getChildren
----------
```javascript
const nodeCollection = tree.getChildren(nodeId)
```
Returns DIRECT descendant of the provided `nodeId` (no grandsons or whatsoever).
[Back to TOC](#api-references)

getDescendants
----------
```javascript
const nodeCollection = tree.getDescendants(nodeId)
```
Listing descendant of the provided `nodeId`
[Back to TOC](#api-references)

countChilds
----------
```javascript
const count = tree.countChilds(nodeId)
```
Returns number of descendant are member of the provided `nodeId`
[Back to TOC](#api-references)

toAdjacencyList
----------
```javascript
const nestedNode = tree.toAdjacencyList(nodeId)
const childNodeCollection = nestedNode.children
```
Adjacency listing of the provided `nodeId`. Direct descendant access by the key `children`. Default empty `nodeId` is `rootId`
[Back to TOC](#api-references)

toLinearList
----------
```javascript
const nodeCollection = tree.toLinearList(nodeId)
```
Listing all nodes in single linear array.
[Back to TOC](#api-references)

## TODO
Covering unit test.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)