GB Maps ギビマップ
==================
NEW ! version 1.0.0 under development (18 Dec 2013)


GB Maps – ギビマップ is a railway route mapping software for BVE / OpenBVE / BVE 5 Trainsim railway simulator.
GB Maps – ギビマップ adalah perisian pemetaan laluan kereta api simulator kereta api BVE / OpenBVE / BVE 5 Trainsim.
GB Maps – ギビマップ はBVE/OpenBVE/BVE 5 Trainsim 鉄道シミュレータの鉄道ルートマッピングソフトウェアである。

Intro
=====
http://gbmaps.karyait.net.my/2013/04/gb-maps-prototype-3-pre-release-part-1.html


Concept / Konsep / コンセプト
=============================
Drawing track on Google Maps, set up track parameters and properties, and then generate BVE route based on the data.
Melukiskan trek di atas peta Google Maps, tetapkan properti serta parameter trek, dan kemudian janakan trek BVE berdasarkan data ini.
Googleマップ上のトラックを描画、トラックパラメータとプロパティを設定してから、データに基づいて、
BVEのルートが生成されます。


System requirements / Keperluan sistem / システム要件
=====================================================
OpenBVE OR BVE 2/4 (BVE 5 Trainsim is not supported at the moment, but future development may fully based on BVE 5 Trainsim, إن شاء الله)
OpenBVE ATAU BVE 2/4 (BVE 5 Trainsim tidak disokong pada masa ini, tetapi pembangunan pada masa depan mungkin
berdasarkan BVE 5 Trainsim sepenuhnya, إن شاء الله)
OpenBVEまたはBVE2/4 : BVE Trainsim 5は、現時点ではサポートされませんが、今後の開発は完全にBVETrainsim 5に基づいてありますإن شاء الله)


for GB Maps / ギビマップ

PC with Microsoft Windows operating system (minimum Windows XP), Mozilla Firefox browser (other browsers is not fully supported, MSIE 9 and below is not supported), internet connection, zip utilities to unzip files (download 7zip here, free/open source software, gnu license).
PC dengan sistem operasi Microsoft Windows (minimum Windows XP), Mozilla pelayar Firefox (pelayar lain tidak disokong sepenuhnya, MSIE 9 dan ke bawah tidak disokong), sambungan internet, utiliti zip ke unzip fail (sila muat turun 7zip di sini, perisian sumber terbuka, lesen GNU).
Microsoft Windowsオペレーティングシステム（最小Windows XPの場合）、Mozilla Firefoxブラウザ（他のブラウザは完全に、MSIE9サポートされていないため、以下のサポートされていません）、インターネット接続、（ここで7zipををダウンロードして、フリー/オープンソースソフトウェアファイルをunzipするzipユーティリティを搭載したPC、GNUライセンス）。
 

Download / ダウンロード
=======================
simulator / シミュレータ : OpenBVE (you also need to download OpenBVE RouteViewer and OpenBVE ObjectViewer that included in "Tools (for add-on developers)").


GB Maps (main program, prototype 3) : http://www.mediafire.com/download.php?7i29p9cpuyvyumc
GB Maps Tools : http://www.mediafire.com/?yjl9xlb9pjams81
GB Maps Tools (railset generator) : http://www.mediafire.com/?f5nop55cyqeidi5
BVE objects : http://www.mediafire.com/download.php?smu79se3lqvu2ye
BVE Rail Generator (csc) : http://www.mediafire.com/download.php?kkkxotw0ij33sda



Installation / インストール
===========================
OpenBVE

http://www.railsimroutes.net/openbve/openbve_windows_1.php
http://odakyufan.zxq.net/openbve/install.html
http://www.youtube.com/watch?v=9u_1UITej8U
http://www.youtube.com/watch?v=Sws-XKPcBy0
http://www.youtube.com/watch?v=RJKmd51IIzE
GB Maps  ギビマップ

First, please download GB Maps main program and then unzip it to your My Documents folder or your local drive.
Mula2, sila muat turun program utama GB Maps dan kemudian unzip ia ke folder My Documents anda atau cakera tempatan anda.
まず、GB Mapsのメインプログラムをダウンロードし、[マイドキュメント]フォルダまたはローカルドライブに解凍してください。

Please download BVE objects file and then unzip it to your BVE / OpenBVE objects folder.
Sila memuat turun fail objek BVE dan kemudian unzip folder objek BVE / OpenBVE anda.
BVEオブジェクトファイルをダウンロードしてあなたのBVE/ OpenBVEオブジェクトフォルダに解凍してください。

You may also need to download GB Maps Tools and GB Maps Tools (railset generator). BVE Rail Generator (csc) is included in BVE objects, you don't need to download it separately.
Anda juga perlu memuat turun GB Maps Tools dan GB Maps Tools (penjana railset). BVE Rail Generator (CSC) telah dibekalkan bersama fail objek BVE, anda tidak perlu untuk memuat turun ia secara berasingan.
また、GB Maps ToolsとGB Maps Tool（railset generator）をダウンロードする必要があります。BVEのレールジェネレータ（CSC）はBVEのオブジェクトファイルに含まれ、別途ダウンロードする必要はありません。
GB Maps program is a just local web pages (.html file) with JavaScript scripting (run locally). You need Internet connection to connect to Google Maps service. Please open "gb maps.html" file with the Mozilla Firefox browser (others browser is not supported or limited support, not tested).
Program GB Maps adalah hanya laman web tempatan (fail .html) dengan skrip JavaScript (dilarikan tempatan). Anda perlu sambungan internet untuk disambungkan ke perkhidmatan Google Maps. Sila buka fail "gb maps.html" dengan pelayar Mozilla Firefox (pelayar lain tidak disokong atau sokongan terhad, tidak diuji).
GB MapsのプログラムはJavaScriptスクリプティング（ローカルで実行される）を持つだけで、ローカルのWebページ（htmlファイル）です。あなたは、Google Mapsのサービスに接続するためにインターネット接続が必要です。 Mozilla Firefoxブラウザ（他のブラウザがサポートされるか、または対応が限られ、テストされていないされていません）で "gb maps.html"ファイルを開いてください。

GB Maps will try to locate your location on the first run OR if you doesn't save your default location (cookie).
GB Maps akan cuba menjejaki lokasi anda pada larian pertama ATAU jika anda tidak menyimpan lokasi lalai anda (cookies).
GB Mapsは最初の実行時にあなたの場所を検索しようまたはあなたのデフォルトの保存場所を（クッキー）していない場合。


Notes / Nota / 注釈:
====================
This software is a prototype software as it is still in the research and development stage. Therefore some features may not functioning or is not available in this release.
Perisian ini adalah perisian prototaip dan ia masih lagi di dalam tahap penyelidikan dan pembangunan. Oleh itu sesetengah ciri mungkin tidak berfungsi atau tidak tersedia dalam terbitan ini.
このソフトウェアは、それが研究開発段階であるため、ソフトウェアのプロトタイプです。従って一部の機能が機能していないか、またはこのリリースでは利用できません可能性があります。

Features that not working (still under development) and planned features /
Ciri-ciri yang tidak berfungsi (masih dalam pembangunan) dan ciri-ciri yang dirancang /
特長作業（まだ開発中）や、計画中の機能ではないこと。

- platform drawing and BVE code generator / melukis platform dan penjana kod BVE (platform) / プラットフォームの描画とBVEコードジェネレーター
- make two line parallel between two point / membuat dua garisan selari di antara dua titik / 2点間の2つの平行な線を作る
- non uniform turnout / belok keluar tidak seragam / 不均一な出足
- multi language feature / fitur pelbagai bahasa / マルチ言語機能
- marker settings / tetapan penanda / マーカの設定
- transition curve for BVE 5 / lengkung peralihan untuk BVE 5 / BVE5の遷移曲線
- code generator for BVE 5 / penjana kod BVE 5 / BVE5用のコードジェネレータ
- hills and mountain ranges views / pemandangan bukit dan banjaran gunung / 丘や山脈の景色
- widening track distance between two parallel track / melebarkan jarak trek antara dua trek selari / 二つの平行なトラック間のトラック間隔を広げる
- options, add-on, etc. / opsyen, add-on dan lain-lain / オプション、アドオン等
 

Websites / Laman Web /  ウェブサイト
====================================
Official Website / Laman Web Rasmi / 公式サイト: 
http://gbmaps.karyait.net.my/ or http://gbmaps.blogspot.com (under construction / 建設中)

Development site (programming) /Pembangunan (pengaturcaraan) / 開発（プログラミング）: 
https://github.com/karyait/gbmaps

Personal blog for GB Maps ギビマップ (discussion on design and mathematical algorithm) / 
perbincangan mengenai reka bentuk dan algoritma matematik / デザインと数学的アルゴリズムについての議論 : 
http://blogkaryait.wordpress.com/tag/gb-maps-2/



(>_<)... すみません！日本語への翻訳にはGoogle Translateを使用して作りました。
どんな翻訳の修正のためのコメントを残してください。

 

Thank you / Terima Kasih / 有り難うございます。(^_^)v



Karya IT / Coretan Alkimia
http://www.karyait.net.my/
http://blogkaryait.wordpress.com/
 

GB Maps ギビマップ - © Karya IT 2012-2013. All rights reserved. This program is distributed in the hope that
it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
FOR A PARTICULAR PURPOSE.

GB Maps ギビマップ by Karya IT is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License. 
Based on a work at Google Developers. Permissions beyond the scope of this license may be available at here. 
Google Maps - ©2012 Google.
