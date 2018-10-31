/** @jsx c */
import c, { Block, Row, Col } from "canner-script";

export default () => (
  <object
    keyName="home"
    title="${home.title}"
    description="${home.description}"
  >
    <Row type="flex" gutter={16}>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Block title="${home.header.layoutTitle}" keyName="header">
          <object keyName="header">
            <image keyName="logo" title="${share.logo}" layout="horizontal"/>
          </object>
        </Block>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12}>
        <Block title="${home.footer.layoutTitle}" keyName="footer">
          <object keyName="footer">
            <image keyName="logo" title="${share.logo}" layout="horizontal" />
            <string keyName="fb" ui="link" title="${home.footer.fb}" layout="horizontal"/>
            <string keyName="ig" ui="link" title="${home.footer.ig}" layout="horizontal" />
            <string keyName="email" ui="link" title="${home.footer.email}" layout="horizontal" />
          </object>
        </Block>
      </Col>
      <Col span={24}>
        <Block title="${home.entry.layoutTitle}" keyName="entry">
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
        </Block>
      </Col>
    </Row>
  </object>
);