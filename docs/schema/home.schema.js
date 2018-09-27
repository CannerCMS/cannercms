/** @jsx c */
import c, { Block } from "canner-script";

export default () => (
  <object
    keyName="home"
    title="${home.title}"
    description="${home.description}"
  >
    <Block title="進場畫面">
      <object keyName="entry">
        <array
          keyName="bannerBg"
          ui="gallery"
          title="背景圖"
        />
        <string keyName="title" title="標題" />
        <string keyName="slogan" title="網站口號" />
      </object>
    </Block>
    <Block title="頁首">
      <object keyName="header">
        <Block>
          <array keyName="topLine" title="跑馬燈" ui="tab">
            <object>
              <string keyName="text" title="文字" />
            </object>
          </array>
        </Block>
        <Block title="SUSS 選單設定">
          <object keyName="sussMenu">
            <image keyName="logo" title="Logo" />
          </object>
        </Block>
        <Block title="Hanata 選單設定">
          <object keyName="hanataMenu">
            <image keyName="logo" title="Logo" />
          </object>
        </Block>
      </object>
    </Block>
    <Block title="頁尾">
      <object keyName="footer">
        <Block title="SUSS 設定">
          <object keyName="sussInfo">
            <image keyName="logo" title="Logo" />
            <string keyName="fb" ui="link" title="FB 連結" />
            <string keyName="ig" ui="link" title="IG 連結" />
            <string keyName="email" ui="link" title="Email 連結" />
            {/* <string keyName="line" ui="link" title="Line 連結" />
            <string keyName="homepage" ui="link" title="首頁連結" /> */}
          </object>
        </Block>
        <Block title="Hanata 設定">
          <object keyName="hanataInfo">
            <image keyName="logo" />
            <string keyName="fb" ui="link" title="FB 連結" />
            <string keyName="ig" ui="link" title="IG 連結" />
            <string keyName="email" ui="link" title="Email 連結" />
            {/* <string keyName="line" ui="link" title="Line 連結" />
            <string keyName="homepage" ui="link" title="首頁連結" /> */}
          </object>
        </Block>
      </object>
    </Block>
  </object>
);