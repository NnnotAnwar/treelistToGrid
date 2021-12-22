$("#grid").kendoTreeList({
    toolbar: ["excel"],
    columns: [
        { field: "FirstName", title: "First Name" },
        { field: "LastName", title: "Last Name", width: 160 },
        { field: "Position" }
    ],
    excel: {
        allPages: true
    },
    pageable: {
        pageSize: 10
    },
    dataSource: {
        transport: {
            read: {
                url: "https://demos.telerik.com/kendo-ui/service/EmployeeDirectory/All",
                dataType: "jsonp"
            }
        },
        schema: {
            model: {
                id: "EmployeeID",
                fields: {
                    parentId: { field: "ReportsTo", nullable: true },
                    EmployeeID: { field: "EmployeeId", type: "number" },
                    Extension: { field: "Extension", type: "number" }
                },
                expanded: true
            }
        }
    }
});