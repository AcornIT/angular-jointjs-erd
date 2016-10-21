angular
  .module('angular-joint-erd', [])
  .directive(
    'diagram',
    function() {
      return {
        restrict : 'E',
        scope : {
          structure : '=ngModel',
          styleOpts : '=styling'
        },
        template : '<div style="overflow: auto; height: 100%; width: 100%;" class="diagram-wrapper"><div class="dgr-elem"></div></div>',
        link : function(scope, element, attrs) {
          if (!jQuery) {
            throw new Error(
              'angular-joint.js requires that jQuery be previously loaded');
          }

          var id = Date.now();
          var dgContainer = $(element).find('.diagram-wrapper');
          dgContainer.attr('id', id);

          var dgElem = dgContainer.find('.dgr-elem');

          if (!joint) {
            throw new Error('angular-joint.js requires that joint.js be loaded');
          }
          var struct = scope.structure;
          var graph = new joint.dia.Graph();
          var paper = new joint.dia.Paper({
            el : dgElem,
            width : '100%',
            height : '99%',
            model : graph,
            gridSize : 1
          });

          var updateLayout = _.debounce(function() {
            var svgHeight = $('g#v-3').get(0).getBBox().height + 100;
            var svgWidth = $('g#v-3').get(0).getBBox().width + 100;
            var dgElemHeight = $(dgContainer).height();
            var dgElemWidth = $(dgContainer).width();

            $(dgElem).css('height',
              svgHeight > dgElemHeight ? svgHeight : '100%');
            $(dgElem).css('width', svgWidth > dgElemWidth ? svgWidth : '100%');
          }, 500);

          graph.on('change', function() {
            updateLayout();
          });

          var styleOpts = scope.styleOpts;

          loadDiagram(graph, struct, styleOpts);

          $(window).on('resize', updateLayout);
        }
      }
    });

function loadDiagram(graph, struct, styleOpts) {
  var classes = {};

  struct.tables.forEach(function(table) {
    classes[table.name] = getUmlClass(table, styleOpts);
  });

  _.each(classes, function(c) {
    graph.addCell(c);
  });

  var relations = getRelations(classes, struct, styleOpts);
  _.each(relations, function(r) {
    graph.addCell(r);
  });

  joint.layout.DirectedGraph.layout(graph, {
    setLinkVertices : false,
    marginX : 20,
    marginY : 20,
    nodeSep : 200,
    rankSep : 200
  })
}

function getRelations(classes, struct, styleOpts) {
  var attrs = {
    text : {
      fill : 'white',
      'font-family' : 'sans-serif'
    },
    rect : {
      stroke : '#31d0c6',
      'stroke-width' : 20
    }
  };

  if (styleOpts) {
    Object.keys(styleOpts).forEach(function(k) {
      switch (k) {
        case 'linkLabelText':
          $.extend(attrs.text, styleOpts[k]);
          break;
        case 'linkLabelRect':
          $.extend(attrs.rect, styleOpts[k]);
      }
    });
  }

  return struct.relations.map(function(rel) {
    attrs.text.text = rel.name;

    return new joint.shapes.uml.Generalization({
      source : {
        id : classes[rel.parent].id
      },
      target : {
        id : classes[rel.child].id
      },
      router : {
        name : 'manhattan',
      },
      connector : {
        name : 'rounded'
      },
      labels : [ {
        position : 0.45,
        attrs : attrs
      } ]
    });
  });
}

function getUmlClass(table, styleOpts) {
  var attrs = {
    '.uml-class-name-rect' : {
      fill : '#ff8450',
      stroke : '#fff',
      'stroke-width' : 0.5,
    },
    '.uml-class-name-text' : {},
    '.uml-class-attrs-rect' : {
      fill : '#fe976a',
      stroke : '#fff',
      'stroke-width' : 0.5,
      'text-align' : 'middle'
    },
    '.uml-class-methods-rect' : {
      fill : '#fe976a',
      stroke : '#fff',
      'stroke-width' : 0.5,
      'text-align' : 'middle'
    },
    '.uml-class-attrs-text' : {
      ref : '.uml-class-attrs-rect',
      'ref-y' : 0.5,
      'y-alignment' : 'middle',
      'font-size' : '12px',
      'text-align' : 'middle'
    },
    '.uml-class-methods-text' : {
      ref : '.uml-class-methods-rect',
      'ref-y' : 0.5,
      'y-alignment' : 'middle'
    }
  };

  if (styleOpts) {
    Object.keys(styleOpts).forEach(function(k) {
      switch (k) {
        case 'tableHeader':
          $.extend(attrs['.uml-class-name-rect'], styleOpts[k]);
          break;
        case 'tableHeaderText':
          $.extend(attrs['.uml-class-name-text'], styleOpts[k]);
          break;
        case 'tableProperties':
          $.extend(attrs['.uml-class-attrs-rect'], styleOpts[k]);
          break;
        case 'tablePropertiesText':
          $.extend(attrs['.uml-class-attrs-text'], styleOpts[k]);
          break;
        case 'tableIndexes':
          $.extend(attrs['.uml-class-methods-rect'], styleOpts[k]);
          break;
        case 'tableIndexesText':
          $.extend([ '.uml-class-methods-text' ], styleOpts[k]);
      }
    });
  }
  return new joint.shapes.uml.Class({
    size : {
      width : 200,
      height : 100
    },
    name : table.name,
    attributes : table.fields && table.fields.map(function(field) {
      return field.name + ' : ' + field.type
    }),
    methods : table.indexes && table.indexes.map(function(index) {
      return index.field + ' : ' + index.direction
    }),
    attrs : attrs
  });
}
