/**
 * @file jq tips
 * @author xucaiyu
 * @email 569455187@qq.com
 * @version 1.0.0
 * @date 2015-05-25
 * @license MIT License 
 */
// tips提示插件
(function(window, undefined){
    var Defaults = {
            container: 'body',
            className: '',
            align: 'bottom',
            showOn: 'mouseover',
            width: '',
            init: function(){},
            bind: function(){}
        };

    function eventOn( event ){
        var ev;

        switch( event ){
            case 'focus':
                ev = 'focus blur'
                break;
            default:
                ev = 'mouseover mouseout'
        }
        return ev;
    }

    function Tips(options){
        this.options = $.extend( {}, Defaults, options ? options : {} );

        this._init()
    }
    Tips.prototype = {
        v: '1.0.0',
        constructor: Tips,
        _init: function(){
            var _self = this,
                opts = _self.options;

            _self.$el = $( opts.container );

            _self._bind();
            _self.options.init();
        },
        _bind: function(){
            var _self = this,
                opts = _self.options;
                ev = eventOn( opts.showOn );

            _self.$el.delegate( opts.className, 'mouseover mouseout', function(e){
                var type = e.type,
                    $me = $(this),
                    text = $me.attr('data-tips');

                // opts.bind($me);
                if( !text )
                    text = opts.bind($me, function(){
                        console.log(_self)
                        _self.update.apply(_self, arguments)
                    });

                if( !text ) return;
            
                if(type == 'mouseover' || type == 'focus'){
                    var offset = $me.offset(),
                        width = $me.outerWidth(),
                        height = $me.outerHeight();

                    _self.$tip = $('<div class="x-tip"><div class="x-tip-arrow"></div><div class="x-tip-inner"></div></div>');
                    _self.$inner = _self.$tip.find('.x-tip-inner');

                    _self.$inner.html( text );
                    _self.$tip.css({
                        width: opts.width
                    })
                    $('body').append( _self.$tip );
                    _self._getRange(offset, width, height);
                    
                }else{
                    _self.$tip.remove();
                }
            })
        },
        update: function(html){
            var _self = this;
            console.log(_self);
            _self.$inner.html( html )
        },
        _getRange: function(offset, width, height){
            var _self = this,
                opts = _self.options,
                tWidth = _self.$tip.outerWidth(),
                tHeight = _self.$tip.outerHeight(),
                winWidth = $(window).width(),
                winHeight = $(window).height(),
                wPointer = offset.left + width/2,
                hPointer = offset.top + height/2,
                $arrow = _self.$tip.find('.x-tip-arrow'),
                arrowWidth = $arrow.outerWidth()/2,
                arrowHeight = $arrow.outerHeight()/2,
                reverse = opts.align;
console.log(arrowWidth);
            var val,
                tipCss = {
                    width: _self.$tip.width()
                },
                arrowCss = {};
            function getAlign( align ){
                switch( align ){
                    case 'top':
                        tipCss.top = offset.top - tHeight - arrowWidth;
                        
                        if( tipCss.top - $(document).scrollTop() < 0 ){
                            reverse = 'bottom';
                            getAlign( reverse )
                            return;
                        }
                        tipCss.left = centerAlign( 'tb' )
                        arrowCss = {
                            left: Math.min(wPointer - tipCss.left - arrowWidth, tWidth - arrowHeight*2),
                            top: tHeight
                        }
                        break;
                    case 'bottom':
                        tipCss.top = offset.top+ height + arrowWidth;
                        
                        if( tipCss.top + tHeight - $(document).scrollTop() > winHeight ){
                            reverse = 'top';
                            getAlign( reverse )
                            return;
                        }
                        tipCss.left = centerAlign( 'tb' )
                        arrowCss = {
                            left: Math.min(wPointer - tipCss.left - arrowWidth, tWidth - arrowHeight*2),
                            top: -arrowWidth
                        }
                        break;
                    case 'left':
                        tipCss.left = offset.left - tWidth - arrowHeight;
                        
                        if( tipCss.left - $(document).scrollLeft() < 0 ){
                            reverse = 'right';
                            getAlign( reverse )
                            return;
                        }
                        tipCss.top = centerAlign()
                        arrowCss = {
                            top: Math.min(hPointer - tipCss.top - arrowHeight, tHeight - arrowHeight*2),
                            left: tWidth
                        }
                        break;
                    case 'right':
                        tipCss.left = offset.left+ width + arrowHeight;
                        
                        if( tipCss.left + tWidth - $(document).scrollLeft() > winWidth ){
                            reverse = 'left';
                            getAlign( reverse )
                            return;
                        }
                        tipCss.top = centerAlign()
                        arrowCss = {
                            top: Math.min(hPointer - tipCss.top - arrowHeight, tHeight - arrowHeight*2),
                            left: -arrowHeight
                        }
                        break;
                }
            }
            getAlign( reverse );

            function centerAlign( align ){
                var scrollLeft,
                    scrollTop,
                    size, val,
                    left, right,
                    top, bottom;

                if( align == 'tb' ){
                    scrollLeft = $(document).scrollLeft();
                    size = tWidth/2;
                    left = wPointer - size;
                    right = wPointer + size;
                    
                    // 左边最小值 scrollLeft
                    left = Math.max(left, scrollLeft );
                    // 右边不足的添加到左边
                    if(right > winWidth+scrollLeft){
                        left -= right - (winWidth+scrollLeft);
                    }
                    // 右边最大值 文档宽
                    right = Math.min(right, winWidth+scrollLeft);
                    
                    // 获取左边最小值
                    val = Math.min(left, right);
                }else{
                    scrollTop = $(document).scrollTop(),
                    size = tHeight/2;
                    top = hPointer - size;
                    bottom = hPointer + size;
                    
                    top = Math.max(top, 0);
                    // 右边不足的添加到左边
                    if(bottom > winHeight){
                        top -= bottom - winHeight;
                    }
                    bottom = Math.min(bottom, winHeight);

                    val = Math.min(top, bottom);
                }

                return val;
            }

            _self.$tip.find('.x-tip-arrow').css( arrowCss )
            _self.$tip.addClass( 'x-tip-' + reverse )
            console.log(reverse)

            _self.$tip.css( tipCss )
            return tipCss;

        }
    }
    'function' === typeof define? define(function(){
        return Tips;
    }) : window.Tips = Tips;
    
})(window, undefined)