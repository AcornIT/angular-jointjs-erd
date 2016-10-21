# **angular-jointjs-erd**
----

[![acorn logo](http://www.acorn.ro/wp-content/uploads/2015/10/Acorn-IT-bg-transparent3.png)](http://www.acorn.ro)

angular-jointjs-erd is essentially an [Angular.js](http://www.angularjs.org) directive that displays a joint.js diagram of a given database structure.

## Installation

#### Bower
```sh
$ bower install --save angular-jointjs-erd
```
#### NPM
```sh
$ npm install --save angular-jointjs-erd
```
Inject module dependency:
```javascript
angular.module('MyModule', ['angular-jointjs-erd'])
```
### Usage
angular-jointjs-erd uses the ng-model attribute to provide the database structure, so it's as easy as defining it inside your scope.
##### HTML
Include the *diagram* directive in your page, using the standard *ng-model* attribute to provide the structure. 
```html
<diagram ng-model="structure"></diagram>
```
##### JavaScript
Define your structure in your controller's scope.
```javascript
$scope.structure = {
    tables : [{
        name : 'Customer',
        fields : [{
                name : 'id',
                type : 'integer'
            }, {
                name : 'name',
                type : 'string'
            }]
        }, {
        name : 'Order',
        fields : [{
                name : 'id',
                type : 'integer'
            }, {
                name : 'custId',
                type : 'integer'
            }]
        }],
    relations : [{
        parent : 'Customer',
        child : 'Order',
        fieldMap : {
            id : 'custId'
        }
    }]
}
```
#### Styling
angular-jointjs-erd supports styling of table nodes and link labels using the *styling* attribute:
```html
<diagram ng-model="structure" styling="styleOpts"></diagram>
```
In your controller, define your styling options:
```javascript
$scope.styleOpts = {
    tableHeader: {
        fill: '#ADD8E6'
    },
    tableHeaderText: {
        fill: 'white'
    }
}
```
**Elements that can be styled:**
- tableHeader         
- tableHeaderText
- tableProperties
- tablePropertiesText
- tableIndexes
- tableIndexesText
- linkLabelRect
- linkLabelText

>Note: Elements are **NOT** styled using CSS properties. For a list of possible properties that can be applied to elements, visit [the >jont.js documentation](http://resources.jointjs.com/docs/jointjs/v1.0/joint.html#specialAttributes).
### Dependencies
* [jQuery](http://www.jquery.com)
* [Angular.js](http://www.angularjs.org)
* [Joint.js](http://www.jointjs.com)

### License
Copyright (c) 2016 Acorn IT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
