angular
    .module('accountApp')
    .directive('colResizable', function() {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                setTimeout(function() {
                    elem.colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        onDrag: function() {
                            //trigger a resize event, so paren-witdh directive will be updated
                            $(window).trigger('resize');
                        }
                    });
                });
            }
        };
    });

    //----- Plugin for resizing table columns