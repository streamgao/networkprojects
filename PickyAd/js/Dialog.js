/*
* Changed by Stream on 10/10/14.
* Dialog Library v1.0.0
* http://cnblogs.com/iamshf
* author:SHF
* Date: 2013-06-14
*/
(function ($) {
    //默认参数
    var PARAMS;
    var DEFAULTPARAMS = {
        Title: "Windows弹出消息", Content: "", Width: 400, Height: 300, URL: "",
        ConfirmFun: new Object, CancelFun: new Object
    };
    var ContentWidth = 0;
    var ContentHeight = 0;
    $.Dialog = {
        Alert: function (params) {
            Show(params, "Alert");
        },
        Confirm: function (params) { Show(params, "Confirm"); },
        //弹出引用其他URL框
        Dialog: function (params) { Show(params, "Dialog") },
        //关闭弹出框
        Close: function () {
            $("#DialogLayer,#Dialog").remove();
        }
    };
    //initalize
    function Init(params) {
        if (params != undefined && params != null) {
            PARAMS = $.extend({},DEFAULTPARAMS, params);
        }
        ContentWidth = PARAMS.Width - 10;
        ContentHeight = PARAMS.Height - 45;
    };
    //show popup

    function Show(params, caller) {
        Init(params);
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        //be in the center
        var positionLeft = (screenWidth - PARAMS.Width) / 2 + $(document).scrollLeft();
        var positionTop = (screenHeight - PARAMS.Height) / 2 + $(document).scrollTop();
        var Content = [];
        Content.push("<div id=\"DialogLayer\" style=\"width:" + $(document).width() + "px;height:" + $(document).height() + "px;\"></div>");
        Content.push("<div id=\"Dialog\" style=\"width:" + PARAMS.Width + "px;height:" + PARAMS.Height + "px;left:" + positionLeft + "px;top:" + positionTop + "px;\">");
        Content.push("    <div id=\"Title\"><span>" + PARAMS.Title + "</span>  </div>");
        Content.push("    <div id=\"Container\" style=\"width:" + ContentWidth + "px;height:" + ContentHeight + "px;\">");
        if (caller == "Dialog") {
            Content.push("        <iframe src=\"" + PARAMS.URL + "\"></iframe>");
        }
        else {
            var TipLineHeight = ContentHeight - 60;
            Content.push("        <table>");
            Content.push("            <tr><td id=\"TipLine\" style=\"height:" + TipLineHeight + "px;\">" + PARAMS.Content + "</td></tr>");
            Content.push("            <tr>");
            Content.push("                <td id=\"BtnLine\">");
            Content.push("                    <input type=\"button\" id=\"btnDialogConfirm\" value=\"Next\" />");
            if (caller == "Confirm") {
                Content.push("                    <input type=\"button\" id=\"btnDialogCancel\" value=\"CANCEL\" />");
            }
            Content.push("                </td>");
            Content.push("            </tr>");
            Content.push("        </table>");
        }
        Content.push("    </div>");
        Content.push("</div>");

        $("body").append(Content.join("\n"));
        SetDialogEvent(caller);

        $()
    }
    //popup event
    function SetDialogEvent(caller) {
        //$("#Dialog #Close").click(function () { $.Dialog.Close(); });
        $("#Dialog #Title").Drag($("#Dialog"));
        if (caller != "Dialog") {
            $("#Dialog #btnDialogConfirm").click(function () {
                $.Dialog.Close();
                if ($.isFunction(PARAMS.ConfirmFun)) {
                    PARAMS.ConfirmFun();
                }
            })
        }
        if (caller == "Confirm") {
            $("#Dialog #btnDialogCancel").click(function () {
                $.Dialog.Close();
                if ($.isFunction(PARAMS.CancelFun)) {
                    PARAMS.CancelFun();
                }
            })
        }
    }
})(jQuery);

//drag
(function ($) {
    $.fn.extend({
        Drag: function (objMoved) {
            return this.each(function () {
                //鼠标按下时的位置
                var mouseDownPosiX;
                var mouseDownPosiY;
                //移动的对象的初始位置
                var objPosiX;
                var objPosiY;
                //移动的对象
                var obj = $(objMoved) == undefined ? $(this) : $(objMoved);
                //是否处于移动状态
                var status = false;

                //鼠标移动时计算移动的位置
                var tempX;
                var tempY;

                $(this).mousedown(function (e) {
                    status = true;
                    mouseDownPosiX = e.pageX;
                    mouseDownPosiY = e.pageY;

                    objPosiX = obj.css("left").replace("px", "");
                    objPosiY = obj.css("top").replace("px", "");
                }).mouseup(function () {
                    status = false;
                });
                $("body").mousemove(function (e) {
                    if (status) {
                        tempX = parseInt(e.pageX) - parseInt(mouseDownPosiX) + parseInt(objPosiX);
                        tempY = parseInt(e.pageY) - parseInt(mouseDownPosiY) + parseInt(objPosiY);
                        obj.css({ "left": tempX + "px", "top": tempY + "px" });
                    }
                }).mouseup(function () {
                    status = false;
                }).mouseleave(function () {
                    status = false;
                });
            });
        }
    })
})(jQuery);