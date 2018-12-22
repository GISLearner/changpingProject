utils.tableInit = {
    initTable: function (selector, url, data, columns, height, pagination, onClickRow) {
        $(selector).bootstrapTable("destroy");
        var gird = $(selector).bootstrapTable({
            method: 'get',
            url: url,
            cache: false,
            //maxHeight: height,
            height: height,
            striped: false,
            pagination: pagination,
            pageSize: 20,
            pageList: [20, 50],
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            columns: columns,
            onClickRow: onClickRow
        });
        gird.bootstrapTable("load", data);
        return gird;
    }
};