/* ================================================================ *

   The MIT License

   jquery.ajaxzip.js Copyright (c) 2013 Jun Takeno , https://github.com/yamitake/jquery.ajaxzip.js

    ajaxzip2.js ---- AjaxZip2 郵便番号→住所変換ライブラリ

    Copyright (c) 2006-2007 Kawasaki Yusuke <u-suke [at] kawa.net>
    http://www.kawa.net/works/ajax/ajaxzip2/ajaxzip2.html

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
* ================================================================ */
(function($) {
  AjaxZip2 = {};
  AjaxZip2.CACHE = [];
  AjaxZip2.PREFMAP = [
    null,       '北海道',   '青森県',   '岩手県',   '宮城県',
    '秋田県',   '山形県',   '福島県',   '茨城県',   '栃木県',
    '群馬県',   '埼玉県',   '千葉県',   '東京都',   '神奈川県',
    '新潟県',   '富山県',   '石川県',   '福井県',   '山梨県',
    '長野県',   '岐阜県',   '静岡県',   '愛知県',   '三重県',
    '滋賀県',   '京都府',   '大阪府',   '兵庫県',   '奈良県',
    '和歌山県', '鳥取県',   '島根県',   '岡山県',   '広島県',
    '山口県',   '徳島県',   '香川県',   '愛媛県',   '高知県',
    '福岡県',   '佐賀県',   '長崎県',   '熊本県',   '大分県',
    '宮崎県',   '鹿児島県', '沖縄県'
  ];

  $.extend({
    ajaxzip : function(zip , options) {
      /**
       * default Options
       */
      var defaults ={
        data_path: "./data" ,
        success:function(data){},
        error:function(data){}
      };
      var opts = $.extend(defaults, options);

      //zip validate
      if(zip.length > 8){
        return opts.error({status: "error" , message : "Over the number of characters"});
      }
      //半角に変換
      zip = zenkakuToHankaku(zip);
      if(false && !zip.match(/^\d{3}-?\d{4}$/)){
        return opts.error({status: "error" , message : "format is invalid"});
      }


      var zip1 = zip.substring(0,3);
      var zip2 = zip.substring(zip.length - 4);
      var nzip = zip1 + zip2;

      var url = opts.data_path + '/zip-' + zip1 + '.json' ;

      if(AjaxZip2.CACHE[zip1]){
          return makeInfo(AjaxZip2.CACHE[zip1] , zip , zip1 , zip2 , opts);
      }

      $.ajax(
        url ,
        {
          dataType: 'json' ,
          success: function(data){
            AjaxZip2.CACHE[zip1] = data;
            return makeInfo(data , zip , zip1 , zip2 , opts);
          },
          error: function(data){
            opts.error(data);
          }
        }
      );
    } ,
    zenkakuToHankaku : function(str){
      return zenkakuToHankaku(str);
    }
  });

  /**
   * 全角を半角に変換する。
   * アルファベットと-のみ対応
   */
  function zenkakuToHankaku(str){
    str = str.replace("ー" , "-");//FIXME ダサい
    return str.replace(/[Ａ-Ｚ ａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  /**
   * json dataより住所を取得
   */
  function makeInfo(data , zip , zip1 , zip2 , opts){
    var nzip = zip1 + zip2;
    if(!data[ nzip ]){
      return opts.error({status: "error" , message : "not found"});
    }

    var info = {
                status: "success" ,
                zip: zip ,
                zip1: zip1 ,
                zip2: zip2 ,
                pref_id : data[nzip][0] ,
                pref: AjaxZip2.PREFMAP[data[nzip][0]] ,
                city: data[nzip][1] ,
                town: data[nzip][2]
              };

    return opts.success(info);
  }

})(jQuery);