$(function () {
    let $ = jQuery;
    let btn = document.querySelector('.checkboxBtn');
    let dataPlace = document.querySelector('#data-placement');
    btn.disabled = true;
    let expandedParent = [];
    let notExpanded = [];
    let parentRow = [];
    let fields = [];
    let rowData = {};
    let crudServiceBaseUrl = 'https://demos.telerik.com/kendo-ui/service';

    let dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read: {
                url: crudServiceBaseUrl + '/EmployeeDirectory',
                dataType: 'jsonp'
            }
        },
        schema: {
            model: {
                id: 'EmployeeId',
                parentId: 'ReportsTo',
                fields: {
                    EmployeeId: { type: 'number', nullable: false },
                    ReportsTo: { field: 'ReportsTo', nullable: true }
                }
            }
        }
    });

    let buildTreeList = () => {
        $('#treelist').kendoTreeList({
            dataSource: dataSource,
            columns: [
                { field: 'FirstName', expandable: true, title: 'First Name', width: 250 },
                { field: 'LastName', title: 'Last Name' },
                { field: 'Position' },
                { field: 'Extension', title: 'Ext', format: '{0:#}' }
            ],
            dataBound: function (e) {
                dataPlace.textContent = js_beautify(JSON.stringify(e.sender.dataSource.data().toJSON()));
                // console.log(e);
                notExpanded = [];
                for (let i = 0; i < e.sender.dataSource.data().length; i++) {
                    let data = e.sender.dataSource.data()[i];
                    // console.log(data.FirstName, data.expanded)
                    if (!data.expanded) { notExpanded.push(data); };
                };
            },
            expand: function (e) {
                btn.disabled = false;
                // notExpanded = [];
                let expTarget = e.model._loaded;
                // console.log(e.model._loaded)
                for (let i in e.sender.columns) {
                    let item = e.sender.columns[i];
                    if (fields.length <= i) {
                        fields.push({ id: i, field: item.field, title: item.title || item.field });
                    }
                };
                for (let i = 0; i < e.sender.dataSource.data().length; i++) {
                    let data = e.sender.dataSource.data()[i];
                    // console.log(data.expanded)
                    // if (data._loaded) { } else { notExpanded.push(data); }
                }
                if (!expTarget) { expandedParent.push(e.model) };
            }
        });
    };

    buildTreeList();

    btn.addEventListener('click', (e) => {
        document.querySelector('#treelist').innerHTML = '';
        let columns = [];
        let levels = [];
        let expandedRowIds = [];
        let newDS = dataSource.data();
        for (let item of expandedParent) {
            expandedRowIds.push(item.id);
        };
        for (let i = 0; i < newDS.length; i++) {
            let data = newDS[i];
            for (let id of expandedRowIds) {
                if (data.id === id) {
                    rowData[id] = data;
                    rowData.length = id;
                };
            };
            for (let item of fields) {
                let level = dataSource.level(data);
                data[`${item.field + level}`] = data[item.field];
            };
            levels.push(dataSource.level(data));
        };
        levels = [...new Set(levels)];
        for (let item of fields) {
            for (let i in levels) {
                columns.push(
                    { field: item.field + i, title: `${item.title} ${Number(i) + 1}` }
                )
            }
        };
        for (let nonExpRow of notExpanded) {
            // let nonExpItem = notExpanded[i];
            // for (let item of fields) {
            //     for (let j in expandedParent) {
            //         let expItem = expandedParent[j];
            //         if (!nonExpItem[`${item.field + (dataSource.level(expItem))}`]) {
            //             nonExpItem[`${item.field + (dataSource.level(expItem))}`] = expItem[item.field]
            //         }
            //     }
            // }
            // console.log(newDS, nonExpItem)
            for (let expRow of expandedParent) {
                if (nonExpRow.parentId === expRow.id) {
                    console.log(expRow, nonExpRow, "YES<RELATIVES")
                    for (let item of fields) {
                        nonExpRow[`${item.field + dataSource.level(expRow)}`] = expRow[item.field];
                    }
                }
            }
        }
        if (btn.checked) {
            $('#treelist').kendoGrid({
                dataSource: newDS,
                columns: columns,
                width: columns.length * 200
            });
            let grid = $("#treelist").data("kendoGrid");
            for (let id of expandedRowIds) {
                var rowUID = grid.dataSource.get(id).uid;
                $("[data-uid='" + rowUID + "']", grid.tbody).css({ 'display': 'none' });
            };
        } else {
            buildTreeList();
        }
    })


    /* Нурлановский код
    var service = 'https://demos.telerik.com/kendo-ui/service';

        $('#treelist').kendoTreeList({

            dataSource: new kendo.data.TreeListDataSource({
                transport: {
                    read: {
                        url: service + '/EmployeeDirectory/All',
                        dataType: 'jsonp'
                    }
                },
                schema: {
                    model: {
                        id: 'EmployeeID',
                        parentId: 'ReportsTo',
                        fields: {
                            ReportsTo: { field: 'ReportsTo',  nullable: true },
                            EmployeeID: { field: 'EmployeeId', type: 'number' },
                            Extension: { field: 'Extension', type: 'number' }
                        },
                        expanded: false
                    }
                }
            }),
            height: 400,
            columns: [
                { field: 'FirstName', title: 'First Name', width: 160},
                { field: 'LastName', title: 'Last Name', width: 160 },
                { field: 'Position', width: 160}
            ],

            expand: function(e){
                var expField = 'FirstName';
                var grid = e.sender;
                var thisDataSource = grid.dataSource;
                var curRow = e.model;
                var childNodes = thisDataSource.childNodes(curRow);
                var curLevel = thisDataSource.level(curRow);
                var columns = grid.columns;
                thisDataSource._hiddenRows = thisDataSource._hiddenRows || [];
            	
                columns.unshift({
                    field: (expField + curLevel),
                    Zwidth: 160
                });
            	
                //console.log('expand:', e, '\n', curLevel, curRow);
            	
                grid.setOptions({columns: columns});
            	
                var parentHidded = false;
                childNodes.forEach(function(childRow){
                    if(!parentHidded){
                        parentHidded = true;
                        // запомнить родительские строки
                        thisDataSource._hiddenRows.push(curRow);
                    }
                    //thisDataSource.filter( { field: 'id', operator: 'neq', value: curRow.id });
                    //console.log(thisDataSource.level(childRow), childRow);
                });
            	
                // скрыть родительские строки
                thisDataSource._hiddenRows.forEach(function(row){
                    var htmlRow = grid.itemFor(row);
                    $(htmlRow).css({'display':'none'});
                });
            }

        });
    */
    /*
    $('#switch').kendoSwitch({
        checked: false,
        change: function (e) {
            if(e.checked){
                var grid = kendo.widgetInstance($('#treelist'));
                var thisDataSource = grid.dataSource;
                var view = thisDataSource.view();
                thisDataSource._toFlat = thisDataSource._toFlat || false;
                if(thisDataSource._toFlat){
                    return;
                }
                thisDataSource._toFlat = true;

                for (let i = 0; i < view.length; i++) {
                    var curRow = view[i];
                    expandToFlat(curRow, grid);
                }            	
                reRenderFlatTree(grid);
            }
        }
    });
	
    var service = 'https://demos.telerik.com/kendo-ui/service';

    $('#treelist').kendoTreeList({

        dataSource: new kendo.data.TreeListDataSource({
            transport: {
                read: {
                    url: service + '/EmployeeDirectory/All',
                    dataType: 'jsonp'
                }
            },
            schema: {
                model: {
                    id: 'EmployeeID',
                    parentId: 'ReportsTo',
                    fields: {
                        ReportsTo: { field: 'ReportsTo',  nullable: true },
                        EmployeeID: { field: 'EmployeeId', type: 'number' },
                        Extension: { field: 'Extension', type: 'number' }
                    },
                    expanded: false
                }
            }
        }),
        height: 400,
        columns: [
            { field: 'FirstName', title: 'First Name', width: 160},
            { field: 'LastName', title: 'Last Name', width: 160 },
            { field: 'Position', width: 160}
        ],
        dataBound: function(e){
            var grid = e.sender;
            var thisDataSource = grid.dataSource;
        },
        expand: function(e){
            var grid = e.sender;
            var thisDataSource = grid.dataSource;
            var curRow = e.model;
            expandToFlat(curRow, grid);
            reRenderFlatTree(grid);
        }

    });
	
    function expandToFlat(curRow, grid){
        var expField = 'FirstName';
        var thisDataSource = grid.dataSource;
        var curLevel = thisDataSource.level(curRow);
        var childNodes = thisDataSource.childNodes(curRow);
        thisDataSource._hiddenRows = thisDataSource._hiddenRows || [];
        grid.oldColumns = grid.oldColumns || grid.columns;
        grid._newColumns = grid._newColumns || {};
    	
        grid._newColumns[curLevel] = {
            'field': (expField + curLevel),
            'Zwidth': 160
        };
    	
        var parentHidded = false;
        childNodes.forEach(function(childRow){
            if(!parentHidded){
                parentHidded = true;
                // запомнить родительские строки
                thisDataSource._hiddenRows.push(curRow);
            }
        	
            // заполнить поля до предыдущего
            Object.keys(grid._newColumns).forEach(function(key){
                let fieldName = grid._newColumns[key].field;
                childRow.set(fieldName, curRow[fieldName]);
            });
        	
            // заполнить предыдущее поле
            childRow.set((expField + curLevel), curRow[expField]);
        	
        });
    }
	
    function reRenderFlatTree(grid){
        var thisDataSource = grid.dataSource;
        // добавить поле
        var columns = [...Object.values(grid._newColumns), ...grid.oldColumns];
        grid.setOptions({'columns': columns});
    	
        // скрыть родительские строки
        thisDataSource._hiddenRows.forEach(function(row){
            var htmlRow = grid.itemFor(row);
            $(htmlRow).css({'display':'none'});
        });
    }
    */
});