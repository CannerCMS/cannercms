/** @jsx c */
import c, { Tabs, Default, Row, Col } from "canner-script";

export default () => (
  <object
    keyName="home"
    title="${home.title}"
    description="${home.description}"
  >
    <Tabs>
      <Default title="${home.entry.layoutTitle}" keyName="entry">
        <object keyName="entry">
          <Row gutter={16}>
            <Col span={12}>
              <string keyName="title" title="${home.entry.title}" />
            </Col>
            <Col span={12}>
              <string keyName="slogan" title="${home.entry.slogan}" />
            </Col>
          </Row>
          <array
            keyName="bannerBg"
            ui="gallery"
            title="${home.entry.bannerBg}"
          />
          
        </object>
      </Default>
      <Default title="${home.header.layoutTitle}" keyName="header">
        <object keyName="header">
          <image keyName="logo" title="${share.logo}" />
        </object>
      </Default>
      <Default title="${home.footer.layoutTitle}" keyName="footer">
        <object keyName="footer">
          <image keyName="logo" title="${share.logo}" />
          <string keyName="fb" ui="link" title="${home.footer.fb}" />
          <string keyName="ig" ui="link" title="${home.footer.ig}" />
          <string keyName="email" ui="link" title="${home.footer.email}" />
        </object>
      </Default>
    </Tabs>
  </object>
);