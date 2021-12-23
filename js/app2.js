$(function () {
    let $ = jQuery;
    let btn = document.querySelector('.checkboxBtn');
    btn.setAttribute('disabled', 'disabled');
    // let promise = new Promise((resolve, reject) => {
    //     let data = $.getJSON('data/data.json');
    //     setTimeout(function () {
    //         resolve(data.responseJSON);
    //         btn.disabled = false;
    //     }, 100);
    // });

    // promise.then((val) => {
    //     let dataPlace = document.querySelector('#data-placement');
    //     dataPlace.textContent = js_beautify(JSON.stringify(val));
    //     btn.addEventListener('click', (e) => {
    //         if (!btn.disabled) {
    //         };
    //     });
    // });
    let expandedParent = [];
    let parentRow = [];
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
    // setInterval(() => {
    //     let dataPlace = document.querySelector('#data-placement');
    //     dataPlace.textContent = js_beautify(JSON.stringify(dataSource._view));
    // }, 3000);
    let columns;
    if (btn.checked) {
        for (let row of parentRow) {
            row[0].style.display = 'none';
        }
        $('#treelist').kendoGrid({
            dataSource: dataSource,
            columns: columns || [
                { field: 'FirstName', expandable: true, title: 'First Name', width: 250 },
                { field: 'LastName', title: 'Last Name' },
                { field: 'Position' },
                { field: 'Extension', title: 'Ext', format: '{0:#}' }
            ],
            width: columns.length * 220
        });
    } else {
        document.querySelector('#treelist').style = '';
        $('#treelist').kendoTreeList({
            dataSource: dataSource,
            dataBound: function (e) {
                btn.disabled = false;
                let dataPlace = document.querySelector('#data-placement');
                dataPlace.textContent = js_beautify(JSON.stringify(dataSource._data));
                let cols = [];
                for (let item of dataSource._data) {
                    for (let j of dataSource._data) {
                        if (item.parentId === j.id) {
                            cols.push(item.parentId)
                        };
                    };
                };
                cols = [...new Set(cols)];
                cols.unshift(null);
                columns = [];
                for (let i of cols) {
                    columns.push({ field: `FirstName${Number(i)}`, expandable: true, title: `First Name ${Number(i)}`, width: 250 });
                };
                for (let i of cols) {
                    columns.push({ field: `LastName${Number(i)}`, title: `Last Name ${Number(i)}` });
                };
                for (let i of cols) {
                    columns.push({ field: `Position${Number(i)}`, title: `Position ${Number(i)}` });
                };
                for (let i of cols) {
                    columns.push({ field: `Extension${Number(i)}`, title: `Ext ${Number(i)}`, format: '{0:#}' });
                };
            },
            columns: [
                { field: 'FirstName', expandable: true, title: 'First Name', width: 250 },
                { field: 'LastName', title: 'Last Name' },
                { field: 'Position' },
                { field: 'Extension', title: 'Ext', format: '{0:#}' }
            ],
            expand: function (e) {
                if (!e.model._loaded) {
                    expandedParent.push(e.model);
                    parentRow.push(e.sender.itemFor(e.model))
                };
            }
        });
    }
    // dataSource.read().then(() => { for (let item of dataSource._data) { console.log(item); item[`FirstName${Number(item.ReportsTo)}`] = item.FirstName } });
    // dataSource.read().then(() => btn.disabled = false)
    btn.addEventListener('click', (e) => {
        document.querySelector('#treelist').innerHTML = '';
        let i = 0;
        for (let item of dataSource._data) {
            // while (curItem.parentId) {
            //
            // }
            if (!item.expanded) {
                for (let j of dataSource._data) {
                    if (item.parentId === null) {
                        item[`FirstName0`] = item.FirstName;
                        item[`LastName0`] = item.LastName;
                        item[`Position0`] = item.Position;
                        item[`Extension0`] = item.Extension;
                    }
                    if (item.parentId) {
                        item[`FirstName${item.parentId}`] = item.FirstName;
                        item[`LastName${item.parentId}`] = item.LastName;
                        item[`Position${item.id}`] = item.Position;
                        item[`Extension${item.id}`] = item.Extension;
                    };
                };
            };
        };
        if (btn.checked) {
            for (let row of parentRow) {
                row[0].style.display = 'none';
            }
            $('#treelist').kendoGrid({
                dataSource: dataSource,
                columns: columns || [
                    { field: 'FirstName', expandable: true, title: 'First Name', width: 250 },
                    { field: 'LastName', title: 'Last Name' },
                    { field: 'Position' },
                    { field: 'Extension', title: 'Ext', format: '{0:#}' }
                ],
                width: columns.length * 220,
                editable: true
            });
        } else {
            document.querySelector('#treelist').style = '';
            $('#treelist').kendoTreeList({
                dataSource: dataSource,
                dataBound: function (e) {
                    let dataPlace = document.querySelector('#data-placement');
                    dataPlace.textContent = js_beautify(JSON.stringify(dataSource._data));
                    let cols = [];
                    for (let item of dataSource._data) {
                        for (let j of dataSource._data) {
                            if (item.parentId === j.id) {
                                cols.push(item.parentId)
                            };
                        };
                    };
                    cols = [...new Set(cols)];
                    columns = [];
                    cols.unshift(null);
                    for (let i of cols) {
                        columns.push({ field: `FirstName${Number(i)}`, expandable: true, title: `First Name ${Number(i)}`, width: 250 });
                    };
                    for (let i of cols) {
                        columns.push({ field: `LastName${Number(i)}`, title: `Last Name ${Number(i)}` });
                    };
                    for (let i of cols) {
                        columns.push({ field: `Position${Number(i)}`, title: `Position ${Number(i)}` });
                    };
                    for (let i of cols) {
                        columns.push({ field: `Extension${Number(i)}`, title: `Ext ${Number(i)}`, format: '{0:#}' });
                    };
                },
                columns: [
                    { field: 'FirstName', expandable: true, title: 'First Name', width: 250 },
                    { field: 'LastName', title: 'Last Name' },
                    { field: 'Position' },
                    { field: 'Extension', title: 'Ext', format: '{0:#}' }
                ]
            });
        }
    });
    /*
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
});