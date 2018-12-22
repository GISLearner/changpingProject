/**
 * html文本操作.
 */
utils.htmlOperate = {
    /**
     * 获取html文本.
     * @@param {string} param1 - param_desc.
     * @@return undefined
     */
    getHtml: function (url, callback) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'text',
            success: function (html) {
                callback(html);
            }
        });
    }
}