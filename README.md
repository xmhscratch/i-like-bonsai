Manipulating hierarchical BST tree structures

## Installation

```sh
npm install i-like-bonsai
```

## Usage

instantiate
----------
```javascript
import bonsai from 'i-like-bonsai'
const tree = bonsai(rootNodeId)
```

Generate new ID
----------
```javascript
const nodeId = bonsai.newID()
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
  - [Contributing](#contributing)
  - [License](#license)

create
----------
```javascript
const { nodeId } = tree.create(parentId)
```
[Back to TOC](#api-references)

import
----------
```javascript
tree.import(nodeCollection)
```
[Back to TOC](#api-references)

moveTo
----------
```javascript
tree.moveTo(nodeId, parentId, adjacentId?)
```
[Back to TOC](#api-references)

delete
----------
```javascript
const errMsg = tree.delete(nodeId)
```
[Back to TOC](#api-references)

getNode
----------
```javascript
const node = tree.getNode(nodeId)
```
[Back to TOC](#api-references)

getRootNode
----------
```javascript
const node = tree.getRootNode()
```
[Back to TOC](#api-references)

getPrevNode
----------
```javascript
const node = tree.getPrevNode(nodeId)
```
[Back to TOC](#api-references)

getNodeByParentIndex
----------
```javascript
const { nodeId } = tree.getNodeByParentIndex(parentId, parentIndex)
```
[Back to TOC](#api-references)

getPaths
----------
```javascript
const nodeCollection = tree.getPaths(nodeId)
```
[Back to TOC](#api-references)

getLevel
----------
```javascript
const level = tree.getLevel(nodeId)
```
[Back to TOC](#api-references)

getDepth
----------
```javascript
const depth = tree.getDepth(nodeId)
```
[Back to TOC](#api-references)

getIndexNumber
----------
```javascript
const nodeIndex = tree.getIndexOf(nodeId)
```
nodeIndex -1 on none exist
[Back to TOC](#api-references)

getChildren
----------
```javascript
const nodeCollection = tree.getChildren(nodeId)
```
[Back to TOC](#api-references)

getDescendants
----------
```javascript
const nodeCollection = tree.getDescendants(nodeId)
```
[Back to TOC](#api-references)

countChilds
----------
```javascript
const count = tree.countChilds(nodeId)
```
[Back to TOC](#api-references)

toAdjacencyList
----------
```javascript
const nestedNode = tree.toAdjacencyList(nodeId)
const childNodeCollection = nestedNode.children
```
[Back to TOC](#api-references)

toLinearList
----------
```javascript
const nodeCollection = tree.toLinearList(nodeId)
```
[Back to TOC](#api-references)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)