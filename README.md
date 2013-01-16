jquery.ajaxzip.js
=================

kawa.netで提供されている[AjaxZip 2.0 - Ajax郵便番号→住所自動入力フォーム（CGI不要版）]("http://www.kawa.net/works/ajax/ajaxzip2/ajaxzip2.html")を元に作成したjquery pluginです。
郵便番号から住所情報の取得をすることができます。



>※サーバ状に配置しないと動作しません。詳しくは下記のテスト方法を参照してください。



使い方
-----
1. jqueryを読み込みます。
2. jquery.ajax.jsを読み込みます。
3. $.ajaxzipメソッドに適切なパラメータを与えハンドリングする。

コード例

    <script type="text/javascript" src="./jquery.ajaxzip.js></script>
    <script type="text/javascript">
      $(function() {
        var zipcode = "164-0001";

        $.ajaxzip(zipcode , {
          success: function(data){
            console.log(data);
            console.log(data.zip);
            console.log(data.zip1);
            console.log(data.zip2);
            console.log(data.pref);
            console.log(data.city);
            console.log(data.town);
          },
          error: function(data){
            console.log("error");
            console.log(data);
          }
        });
      });
    </script>



テスト方法
----
ajaxを用いて住所データを取得するためwebサーバを起動する必要があります。
※データディレクトリは同じドメイン配下に置く必要があります。

作者は [jekyll](http://jekyllrb.com/) を用いて起動しています。

jquery.ajaxzip.js]jekyll
ブラウザより localhost:4000/test.htmlにアクセス。

test.htmlが開ければ。apacheでもnginxでも大丈夫です。


郵便番号辞書のアップデート手順
----
引用:[郵便番号辞書のアップデート手順]("http://www.kawa.net/works/ajax/ajaxzip2/ajaxzip2.html")
>最新の[郵便番号辞書]("http://www.post.japanpost.jp/zipcode/dl/kogaki.html") を利用したい場合は、 以下の手順で最新版にアップデートにアップデートできます。


    $ cd jquery.ajaxzip/work

    $ wget http://www.post.japanpost.jp/zipcode/dl/kogaki/lzh/ken_all.lzh
    100%[=============================================>] 1,721,445      4.53M/s
    17:32:58 (4.52 MB/s) - `ken_all.lzh' saved [1721445/1721445]

    $ wget http://www.post.japanpost.jp/zipcode/dl/jigyosyo/lzh/jigyosyo.lzh
    100%[=============================================>] 781,802       --.--K/s
    17:33:12 (6.73 MB/s) - `jigyosyo.lzh' saved [781802/781802]

    $ lha x ken_all.lzh
    ken_all.csv     - Melted   :  ooooooooooooooooooooooooooooooooooooooooooooooooooooo

    $ lha x jigyosyo.lzh
    jigyosyo.csv    - Melted   :  ooooooooooooooooooooooooooooooooooooooooooooooooooo

    $ perl csv2jsonzip.pl ken_all.csv jigyosyo.csv
    ken_all:        ken_all.csv
    北海道          .......................................... 8208 lines
    青森県          ............. 2495 lines
    岩手県          .......... 1935 lines
           （中略）
    宮崎県          ..... 875 lines
    鹿児島県        ........ 1434 lines
    沖縄県          .... 790 lines
    jigyosyo:       jigyosyo.csv
    北海道          ....... 1244 lines
    青森県          .. 207 lines
    岩手県          . 180 lines
           （中略）
    宮崎県          . 169 lines
    鹿児島県        .. 254 lines
    沖縄県          .. 229 lines
    json:           ../data/zip-%s.json
    ../data/zip-0**.json  .......... 96 files
    ../data/zip-1**.json  ......... 85 files
    ../data/zip-2**.json  ......... 90 files
    ../data/zip-3**.json  .......... 100 files
    ../data/zip-4**.json  .......... 97 files
    ../data/zip-5**.json  .......... 98 files
    ../data/zip-6**.json  .......... 94 files
    ../data/zip-7**.json  .......... 99 files
    ../data/zip-8**.json  .......... 100 files
    ../data/zip-9**.json  .......... 96 files

    $ rm -f ken_all.lzh ken_all.csv jigyosyo.lzh jigyosyo.csv