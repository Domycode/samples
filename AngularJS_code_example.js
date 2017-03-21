// =======================================================================================================================================
// Sample#1 : Controller

'use strict';
var index = angular.module('mean.system');

index.controller('IndexCtrl', ['NgMap', function(NgMap) {

    var vm = this;
    vm.trafficLayer;
    vm.mapPosition = [43.667112, -79.392742];

    NgMap.getMap({ id: 'indexMap' }).then(function(map) {
        vm.map = map;
        vm.trafficLayer = new google.maps.TrafficLayer();
    });

    vm.searchPlace = function() {
        if (vm.searchedAddress)
            vm.mapPosition = vm.searchedAddress;
    };

    vm.roadMap = function() {
        vm.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    };

    vm.hybridMap = function() {
        vm.map.setMapTypeId(google.maps.MapTypeId.HYBRID)
    };

    vm.trafficToggle = function() {
        if (vm.trafficLayer.getMap() == null) {
            vm.trafficLayer.setMap(vm.map);
        } else {
            vm.trafficLayer.setMap(null);
        }
    };

}]);

// =======================================================================================================================================
// Sample#2 : Factory
'use strict';

angular.module('mean.project').factory('Appliance', ['$resource',
    function($resource) {
        return $resource('api/appliance/:id', { id: '@_id' }, {
            update: {
                method: 'PUT'
            },
            getByUserId: {
                method: 'GET',
                isArray: true,
                url: '/api/appliance/client/:userId'
            },
            pushJob: {
                method: 'PATCH',
                url: '/api/appliance/'
            }
        })
    }
]);

// =======================================================================================================================================
// Sample#3 : Routes
'use strict';

angular.module('mean.project').config(['$meanStateProvider', '$urlRouterProvider',
    function($meanStateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $meanStateProvider
            .state('home', {
                url: '/',
                templateUrl: 'project/views/system/index.html',
                resolve: {
                    loggedin: function(MeanUser) {
                        return MeanUser.checkLoggedin()
                    }
                }
            })
            .state('areas', {
                url: '/system/areas',
                templateUrl: 'project/views/areas/index.html',
                requiredResource: {
                    resources: ['area.view']
                },
                resolve: {
                    loggedin: function(MeanUser) {
                        return MeanUser.checkLoggedin()
                    },
                    loadResources: function(MeanUser) {
                        return MeanUser.loadResources();
                    }
                }
            })
    }
]).config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
]);


// =======================================================================================================================================
// Sample#4 : Directives
'use strict';

angular.module('mean.project').directive('gridMain', ['Global', '$window', function(Global, $window) {
    return {
        restrict: 'A',
        scope: {
            columnDefs: '=',
            data: '=',
            id: '='
        },
        template: '<div ui-grid="gridCtrl.gridOptions" ui-grid-pagination class="grid custom-grid" ui-grid-auto-resize ng-style="gridCtrl.getTableHeight()">',

        controller: function() {
            var vm = this;

            vm.gridOptions = {
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                paginationPageSize: 5,
                paginationPageSizes: [5, 10, 15],
                selectionRowHeaderWidth: 45,
                enablePaginationControls: false,
                showGridFooter: false,
                rowHeight: 50,
                headerHeight: 50,
                appScopeProvider: vm,
                enableColumnMenus: false,
                columnDefs: vm.columnDefs,
                data: vm.data
            };

            vm.gridOptions.onRegisterApi = function(gridApi) {
                vm.gridApiOptions = gridApi;
                gridApi.core.registerColumnsProcessor(hideIdColumn);

                function hideIdColumn(columns) {
                    columns.forEach(function(column) {
                        if ($window.innerWidth < 1025 && column.cellClass == 'hide_column') {
                            column.visible = false;
                        }
                        if ($window.innerWidth < 1025 && typeof(column.cellClass) !== 'undefined' && column.cellClass.indexOf('mobile-width') != -1) {
                            console.log(column.cellClass.replace('mobile-width-', ''));
                            column.width = parseInt(column.cellClass.replace('mobile-width-', ''));
                        }
                    });
                    return columns;
                }
            };

            vm.getIndex = function(index) {
                index += (vm.gridApiOptions.pagination.getPage() - 1) * parseInt(vm.gridOptions.paginationPageSize);
                return index;
            };

            vm.getTableHeight = function() {
                if (vm.data.length < 5) {
                    return { height: (vm.gridOptions.paginationPageSize * vm.gridOptions.rowHeight + vm.gridOptions.headerHeight) + "px" }
                }
                return { height: (vm.data.length * vm.gridOptions.rowHeight + vm.gridOptions.headerHeight) + "px" }
            };

            vm.hasPermission = function(value) {
                return Global.isActionAllowed(value);
            }

        },
        bindToController: true,
        controllerAs: 'gridCtrl'
    }
}]);

// =======================================================================================================================================
// Sample#5.1 : Filter

'use strict';
angular.module('mean.project')
    .filter('charactersLeft', function() {
        return function(input) {
            var left;
            input = input || "";
            return left = 500 - input.length;
        }
    });

// =======================================================================================================================================
// Sample#5.2 : Filter

'use strict';
angular.module('mean.project')
    .filter('charactersReplace', function() {
        return function(input) {
            return String(input)
                .replace(/&amp;/g, '\&')
                .replace(/&quot;/g, '\"')
                .replace(/&#39;/g, '\'')
                .replace(/&lt;/g, '\<')
                .replace(/&gt;/g, '\>');
        }
    });
// =======================================================================================================================================